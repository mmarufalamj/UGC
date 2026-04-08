import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("database.sqlite");

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name_bn TEXT NOT NULL,
    role TEXT NOT NULL,
    division TEXT,
    status TEXT DEFAULT 'Active',
    photo TEXT,
    signature TEXT
  );
`);

// Migration: Add photo and signature columns if they don't exist
try {
  const columns = db.prepare("PRAGMA table_info(users)").all() as any[];
  const hasPhoto = columns.some(c => c.name === 'photo');
  const hasSignature = columns.some(c => c.name === 'signature');
  
  if (!hasPhoto) {
    db.exec("ALTER TABLE users ADD COLUMN photo TEXT");
  }
  if (!hasSignature) {
    db.exec("ALTER TABLE users ADD COLUMN signature TEXT");
  }
} catch (e) {
  console.error("User migration error:", e);
}

// Migration: Add slug column to roles if it doesn't exist
try {
  const roleColumns = db.prepare("PRAGMA table_info(roles)").all() as any[];
  const hasSlug = roleColumns.some(c => c.name === 'slug');
  if (!hasSlug) {
    db.exec("ALTER TABLE roles ADD COLUMN slug TEXT");
    // Update existing roles with slugs if any
    db.prepare("UPDATE roles SET slug = 'admin' WHERE name = 'Admin'").run();
    db.prepare("UPDATE roles SET slug = 'employee' WHERE name = 'Employee'").run();
    // For others, just use lowercase name as slug
    db.exec("UPDATE roles SET slug = LOWER(REPLACE(name, ' ', '_')) WHERE slug IS NULL");
  }
} catch (e) {
  console.error("Role migration error:", e);
}

db.exec(`
  CREATE TABLE IF NOT EXISTS divisions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    head TEXT NOT NULL,
    employees INTEGER DEFAULT 0,
    status TEXT DEFAULT 'Active'
  );

  CREATE TABLE IF NOT EXISTS roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    name_bn TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'Active'
  );

  CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tracking_no TEXT UNIQUE NOT NULL,
    user_email TEXT NOT NULL,
    user_name TEXT NOT NULL,
    division TEXT NOT NULL,
    service_type TEXT NOT NULL,
    problem_details TEXT,
    status TEXT DEFAULT 'Submitted',
    submission_date TEXT NOT NULL
  );
`);

// Ensure division column exists for existing databases
try {
  db.exec("ALTER TABLE users ADD COLUMN division TEXT");
} catch (e) {
  // Column likely already exists
}

// Seed initial data if empty
const userCount = db.prepare("SELECT count(*) as count FROM users").get() as { count: number };
if (userCount.count === 0) {
  const insertUser = db.prepare("INSERT INTO users (name, email, password, name_bn, role, division, status) VALUES (?, ?, ?, ?, ?, ?, ?)");
  insertUser.run("Admin User", "admin@ugc.gov.bd", "password", "অ্যাডমিন ইউজার", "admin", "আইসিটি বিভাগ", "Active");
  insertUser.run("Hardware Desk Officer", "hardware@ugc.gov.bd", "password", "ডেস্ক অফিসার (হার্ডওয়্যার)", "desk_officer_hardware", "আইসিটি বিভাগ", "Active");
  insertUser.run("Network Desk Officer", "network@ugc.gov.bd", "password", "ডেস্ক অফিসার (নেটওয়ার্ক)", "desk_officer_network", "আইসিটি বিভাগ", "Active");
  insertUser.run("Software Desk Officer", "software@ugc.gov.bd", "password", "ডেস্ক অফিসার (সফটওয়্যার)", "desk_officer_software", "আইসিটি বিভাগ", "Active");
  insertUser.run("Maintenance Desk Officer", "maintenance@ugc.gov.bd", "password", "ডেস্ক অফিসার (মেইনটেন্যান্স)", "desk_officer_maintenance", "আইসিটি বিভাগ", "Active");
  insertUser.run("Test Employee", "employee@ugc.gov.bd", "password", "টেস্ট কর্মচারী", "employee", "প্রশাসন বিভাগ", "Active");
  insertUser.run("Maruf Alam", "maruf@ugc.gov.bd", "password", "মারুফ আলম", "employee", "অর্থ ও হিসাব বিভাগ", "Inactive");
}

const divisionCount = db.prepare("SELECT count(*) as count FROM divisions").get() as { count: number };
if (divisionCount.count === 0) {
  const insertDiv = db.prepare("INSERT INTO divisions (name, head, employees, status) VALUES (?, ?, ?, ?)");
  insertDiv.run("আইসিটি বিভাগ", "পরিচালক (আইসিটি)", 25, "Active");
  insertDiv.run("প্রশাসন বিভাগ", "সচিব", 45, "Active");
  insertDiv.run("অর্থ ও হিসাব বিভাগ", "পরিচালক (অর্থ)", 30, "Active");
  insertDiv.run("পরিকল্পনা ও উন্নয়ন বিভাগ", "পরিচালক (পরিকল্পনা)", 20, "Active");
}

const roleCount = db.prepare("SELECT count(*) as count FROM roles").get() as { count: number };
if (roleCount.count === 0) {
  const insertRole = db.prepare("INSERT INTO roles (name, slug, name_bn, description, status) VALUES (?, ?, ?, ?, ?)");
  insertRole.run("Admin", "admin", "অ্যাডমিন", "সিস্টেমের পূর্ণ নিয়ন্ত্রণ", "Active");
  insertRole.run("Desk Officer (Hardware)", "desk_officer_hardware", "ডেস্ক অফিসার (হার্ডওয়্যার)", "হার্ডওয়্যার সংক্রান্ত সেবা সমাধান", "Active");
  insertRole.run("Desk Officer (Network)", "desk_officer_network", "ডেস্ক অফিসার (নেটওয়ার্ক)", "নেটওয়ার্ক সংক্রান্ত সেবা সমাধান", "Active");
  insertRole.run("Desk Officer (Software)", "desk_officer_software", "ডেস্ক অফিসার (সফটওয়্যার)", "সফটওয়্যার সংক্রান্ত সেবা সমাধান", "Active");
  insertRole.run("Desk Officer (Maintenance)", "desk_officer_maintenance", "ডেস্ক অফিসার (মেইনটেন্যান্স)", "সিস্টেম মেইনটেন্যান্স সেবা সমাধান", "Active");
  insertRole.run("Employee", "employee", "কর্মচারী", "সেবা অনুরোধ দাখিল", "Active");
}

const appCount = db.prepare("SELECT count(*) as count FROM applications").get() as { count: number };
if (appCount.count === 0) {
  const insertApp = db.prepare("INSERT INTO applications (tracking_no, user_email, user_name, division, service_type, problem_details, status, submission_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
  insertApp.run("ITSF-2026-0001", "employee@ugc.gov.bd", "Test Employee", "প্রশাসন বিভাগ", "হার্ডওয়্যার", "প্রিন্টার কাজ করছে না", "Done", "08/04/2026");
  insertApp.run("ITSF-2026-0002", "employee@ugc.gov.bd", "Test Employee", "প্রশাসন বিভাগ", "নেটওয়ার্ক", "ইন্টারনেট সংযোগ বিচ্ছিন্ন", "In Progress", "08/04/2026");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Auth API
  app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ? AND password = ?").get(email, password) as any;
    
    if (user) {
      if (user.status === 'Inactive') {
        return res.status(403).json({ success: false, message: "আপনার অ্যাকাউন্টটি নিষ্ক্রিয়। আইসিটি বিভাগের সাথে যোগাযোগ করুন।" });
      }
      res.json({ 
        success: true, 
        user: { 
          name: user.name, 
          name_bn: user.name_bn, 
          role: user.role,
          email: user.email,
          division: user.division
        } 
      });
    } else {
      res.status(401).json({ success: false, message: "ভুল ইমেইল অথবা পাসওয়ার্ড।" });
    }
  });

  // Divisions API
  app.get("/api/divisions", (req, res) => {
    const divisions = db.prepare("SELECT * FROM divisions").all();
    res.json(divisions);
  });

  app.post("/api/divisions", (req, res) => {
    const { name, head, employees, status } = req.body;
    const info = db.prepare("INSERT INTO divisions (name, head, employees, status) VALUES (?, ?, ?, ?)")
      .run(name, head, employees, status);
    res.json({ id: info.lastInsertRowid, name, head, employees, status });
  });

  app.put("/api/divisions/:id", (req, res) => {
    const { id } = req.params;
    const { name, head, employees, status } = req.body;
    db.prepare("UPDATE divisions SET name = ?, head = ?, employees = ?, status = ? WHERE id = ?")
      .run(name, head, employees, status, id);
    res.json({ id, name, head, employees, status });
  });

  app.delete("/api/divisions/:id", (req, res) => {
    const { id } = req.params;
    db.prepare("DELETE FROM divisions WHERE id = ?").run(id);
    res.json({ success: true });
  });

  // Users API
  app.get("/api/users", (req, res) => {
    const users = db.prepare("SELECT id, name, email, password, name_bn, role, division, status FROM users").all();
    res.json(users);
  });

  app.post("/api/users", (req, res) => {
    const { name, email, name_bn, role, division, status, password } = req.body;
    try {
      const info = db.prepare("INSERT INTO users (name, email, password, name_bn, role, division, status) VALUES (?, ?, ?, ?, ?, ?, ?)")
        .run(name, email, password || 'password', name_bn || name, role, division, status);
      res.json({ id: info.lastInsertRowid, name, email, name_bn: name_bn || name, role, division, status });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.put("/api/users/:id", (req, res) => {
    const { id } = req.params;
    const { name, email, name_bn, role, division, status, password } = req.body;
    if (password) {
      db.prepare("UPDATE users SET name = ?, email = ?, password = ?, name_bn = ?, role = ?, division = ?, status = ? WHERE id = ?")
        .run(name, email, password, name_bn || name, role, division, status, id);
    } else {
      db.prepare("UPDATE users SET name = ?, email = ?, name_bn = ?, role = ?, division = ?, status = ? WHERE id = ?")
        .run(name, email, name_bn || name, role, division, status, id);
    }
    res.json({ id, name, email, name_bn: name_bn || name, role, division, status });
  });

  app.delete("/api/users/:id", (req, res) => {
    const { id } = req.params;
    db.prepare("DELETE FROM users WHERE id = ?").run(id);
    res.json({ success: true });
  });

  // Roles API
  app.get("/api/roles", (req, res) => {
    const roles = db.prepare("SELECT * FROM roles").all();
    res.json(roles);
  });

  app.post("/api/roles", (req, res) => {
    const { name, slug, name_bn, description, status } = req.body;
    const info = db.prepare("INSERT INTO roles (name, slug, name_bn, description, status) VALUES (?, ?, ?, ?, ?)")
      .run(name, slug, name_bn, description, status);
    res.json({ id: info.lastInsertRowid, name, slug, name_bn, description, status });
  });

  app.put("/api/roles/:id", (req, res) => {
    const { id } = req.params;
    const { name, slug, name_bn, description, status } = req.body;
    db.prepare("UPDATE roles SET name = ?, slug = ?, name_bn = ?, description = ?, status = ? WHERE id = ?")
      .run(name, slug, name_bn, description, status, id);
    res.json({ id, name, slug, name_bn, description, status });
  });

  app.delete("/api/roles/:id", (req, res) => {
    const { id } = req.params;
    db.prepare("DELETE FROM roles WHERE id = ?").run(id);
    res.json({ success: true });
  });

  // Applications API
  app.get("/api/applications", (req, res) => {
    const { email } = req.query;
    let applications;
    if (email) {
      applications = db.prepare("SELECT * FROM applications WHERE user_email = ? ORDER BY id DESC").all(email);
    } else {
      applications = db.prepare("SELECT * FROM applications ORDER BY id DESC").all();
    }
    res.json(applications);
  });

  app.post("/api/applications", (req, res) => {
    const { user_email, user_name, division, service_type, problem_details } = req.body;
    const year = new Date().getFullYear();
    
    // Generate tracking number: ITSF-YYYY-XXXX
    const lastApp = db.prepare("SELECT tracking_no FROM applications WHERE tracking_no LIKE ? ORDER BY id DESC LIMIT 1")
      .get(`ITSF-${year}-%`) as { tracking_no: string } | undefined;
    
    let nextSerial = 1;
    if (lastApp) {
      const parts = lastApp.tracking_no.split("-");
      nextSerial = parseInt(parts[2]) + 1;
    }
    
    const tracking_no = `ITSF-${year}-${nextSerial.toString().padStart(4, '0')}`;
    const submission_date = new Date().toLocaleDateString('en-GB'); // DD/MM/YYYY
    
    const info = db.prepare("INSERT INTO applications (tracking_no, user_email, user_name, division, service_type, problem_details, status, submission_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
      .run(tracking_no, user_email, user_name, division, service_type, problem_details, 'Submitted', submission_date);
    
    res.json({ id: info.lastInsertRowid, tracking_no, status: 'Submitted', submission_date });
  });

  app.put("/api/applications/:id/status", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    db.prepare("UPDATE applications SET status = ? WHERE id = ?").run(status, id);
    res.json({ success: true });
  });

  // Profile Update API
  app.put("/api/profile", (req, res) => {
    const { email, photo, signature } = req.body;
    try {
      if (photo !== undefined && signature !== undefined) {
        db.prepare("UPDATE users SET photo = ?, signature = ? WHERE email = ?").run(photo, signature, email);
      } else if (photo !== undefined) {
        db.prepare("UPDATE users SET photo = ? WHERE email = ?").run(photo, email);
      } else if (signature !== undefined) {
        db.prepare("UPDATE users SET signature = ? WHERE email = ?").run(signature, email);
      }
      
      const user = db.prepare("SELECT name, name_bn, email, role, division, photo, signature FROM users WHERE email = ?").get(email);
      res.json({ success: true, user });
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({ success: false, message: "প্রোফাইল আপডেট করতে সমস্যা হয়েছে" });
    }
  });

  // Stats API
  app.get("/api/stats", (req, res) => {
    const userCount = db.prepare("SELECT count(*) as count FROM users").get() as { count: number };
    const divisionCount = db.prepare("SELECT count(*) as count FROM divisions").get() as { count: number };
    const roleCount = db.prepare("SELECT count(*) as count FROM roles").get() as { count: number };
    
    const totalApps = db.prepare("SELECT count(*) as count FROM applications").get() as { count: number };
    const inProgressApps = db.prepare("SELECT count(*) as count FROM applications WHERE status = 'In Progress'").get() as { count: number };
    const resolvedApps = db.prepare("SELECT count(*) as count FROM applications WHERE status = 'Done'").get() as { count: number };

    res.json({
      totalUsers: userCount.count,
      totalDivisions: divisionCount.count,
      totalRoles: roleCount.count,
      totalApplications: totalApps.count,
      inProgressApplications: inProgressApps.count,
      resolvedApplications: resolvedApps.count
    });
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
