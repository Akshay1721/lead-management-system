import Lead from "../models/Lead.js";

// Build query from rubric operators, AND-combined, and scoped to user
const buildQuery = (q, userId) => {
  const query = { user: userId };

  // Strings: equals, contains
  for (const f of ["email", "company", "city"]) {
    if (q[`${f}_eq`]) query[f] = q[`${f}_eq`];
    if (q[`${f}_contains`]) query[f] = { $regex: String(q[`${f}_contains`]), $options: "i" };
  }

  // Enums: equals, in
  for (const f of ["status", "source"]) {
    if (q[`${f}_eq`]) query[f] = q[`${f}_eq`];
    if (q[`${f}_in`]) query[f] = { $in: String(q[`${f}_in`]).split(",").map(s => s.trim()) };
  }

  // Numbers: equals, gt, lt, between
  for (const f of ["score", "lead_value"]) {
    const eq = q[`${f}_eq`], gt = q[`${f}_gt`], lt = q[`${f}_lt`], between = q[`${f}_between`];
    if (eq !== undefined) query[f] = Number(eq);
    if (gt || lt || between) {
      query[f] = typeof query[f] === "object" ? query[f] : {};
      if (gt !== undefined) query[f].$gt = Number(gt);
      if (lt !== undefined) query[f].$lt = Number(lt);
      if (between) {
        const [a, b] = String(between).split(",").map(Number);
        if (!isNaN(a)) query[f].$gte = a;
        if (!isNaN(b)) query[f].$lte = b;
      }
    }
  }

  // Dates: on, before, after, between (created_at, last_activity_at)
  for (const f of ["created_at", "last_activity_at"]) {
    const on = q[`${f.replace("_at", "")}_on`];
    const before = q[`${f.replace("_at", "")}_before`];
    const after = q[`${f.replace("_at", "")}_after`];
    const between = q[`${f.replace("_at", "")}_between`];

    if (on) query[f] = { $gte: new Date(on), $lt: new Date(new Date(on).getTime() + 24 * 3600 * 1000) };
    if (before || after || between) query[f] = query[f] || {};
    if (before) query[f].$lt = new Date(before);
    if (after) query[f].$gt = new Date(after);
    if (between) {
      const [a, b] = String(between).split(",");
      if (a) query[f].$gte = new Date(a);
      if (b) query[f].$lte = new Date(b);
    }
  }

  // Boolean: equals
  if (q["is_qualified_eq"] !== undefined) {
    query.is_qualified = String(q["is_qualified_eq"]).toLowerCase() === "true";
  }

  return query;
};

export const createLead = async (req, res, next) => {
  try {
    const payload = { ...req.body, user: req.userId };
    const lead = await Lead.create(payload);
    return res.status(201).json(lead);
  } catch (err) {
    // duplicate email per user -> 409
    if (err?.code === 11000) return res.status(409).json({ message: "Lead email already exists for this user" });
    return res.status(500).json({ message: err.message });
  }
};

export const getLeads = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const rawLimit = Math.max(parseInt(req.query.limit || "20", 10), 1);
    const limit = Math.min(rawLimit, 100);

    const query = buildQuery(req.query, req.userId);
    const total = await Lead.countDocuments(query);
    const data = await Lead.find(query)
      .sort({ created_at: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json({
      data,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getLead = async (req, res) => {
  try {
    const lead = await Lead.findOne({ _id: req.params.id, user: req.userId });
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    return res.status(200).json(lead);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true }
    );
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    return res.status(200).json(lead);
  } catch (err) {
    if (err?.code === 11000) return res.status(409).json({ message: "Lead email already exists for this user" });
    return res.status(500).json({ message: err.message });
  }
};

export const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    return res.status(200).json({ message: "Lead deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
