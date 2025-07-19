# JD Marc Limited - Test Accounts

## Quick Access Credentials

### 🔧 **Admin Account**

- **Email:** `admin@jdmarcng.com`
- **Password:** `admin123`
- **Staff Member:** ✅ Yes
- **Department:** Secretariat & Administration
- **UniqueKey:** `SA1234`
- **Features:** Full admin access, user management, UniqueKey generation, system analytics

---

### 👥 **Department Staff Accounts**

#### 🏢 **Secretariat & Administration**

- **Email:** `secretary@jdmarcng.com`
- **Password:** `secretary123`
- **UniqueKey:** `SA5678`
- **Dashboard:** Scheduling, document management, visitor logs, executive briefings

#### 💰 **Accounting & Finance**

- **Email:** `accountant@jdmarcng.com`
- **Password:** `accounting123`
- **UniqueKey:** `AC3456`
- **Dashboard:** Invoicing, payroll, budget management, financial reporting

#### 👨‍💼 **Human Resources**

- **Email:** `hr@jdmarcng.com`
- **Password:** `hr123`
- **UniqueKey:** `HR7890`
- **Dashboard:** Employee records, recruitment, leave management, performance tracking

#### 🏗️ **Project Management**

- **Email:** `pm@jdmarcng.com`
- **Password:** `project123`
- **UniqueKey:** `PM2468`
- **Dashboard:** Project cards, Gantt charts, resource management, team coordination

#### 📈 **Business Development**

- **Email:** `bd@jdmarcng.com`
- **Password:** `business123`
- **UniqueKey:** `BD1357`
- **Dashboard:** Lead tracking, proposals, partnerships, revenue management

#### 📱 **Digital Marketing**

- **Email:** `marketing@jdmarcng.com`
- **Password:** `marketing123`
- **UniqueKey:** `DM9876`
- **Dashboard:** Campaign analytics, content pipeline, social media management

#### 🏛️ **Business Administration**

- **Email:** `ba@jdmarcng.com`
- **Password:** `administration123`
- **UniqueKey:** `BA5432`
- **Dashboard:** Organization KPIs, approval workflows, governance oversight

---

### 👤 **Regular User Accounts** (No Staff Verification)

#### **Regular User**

- **Email:** `user@jdmarcng.com`
- **Password:** `user123`
- **Staff Member:** ❌ No
- **Features:** General dashboard, no department assignment

#### **Test User**

- **Email:** `test@jdmarcng.com`
- **Password:** `test123`
- **Staff Member:** ❌ No
- **Features:** General dashboard, basic user features

---

## 🧪 **How to Test**

### **For Staff Members:**

1. Go to login page
2. ✅ **Check "Are you a staff member?"**
3. Select the appropriate department from dropdown
4. Enter email and password
5. **After initial login validation, enter the UniqueKey when prompted**
6. Access department-specific dashboard

### **For Regular Users:**

1. Go to login page
2. ❌ **Leave "Are you a staff member?" unchecked**
3. Enter email and password
4. Access general dashboard (department assignment pending)

### **For Admin Testing:**

1. Login with admin account
2. Navigate to Admin Dashboard
3. Go to "Keys" tab to manage UniqueKeys
4. Test user management, role assignments, system analytics

---

## 🔐 **UniqueKey System Testing**

### **Valid Keys:**

- Each department has working UniqueKeys (see above)
- Format: Department prefix + 4 digits (e.g., `HR7890`)

### **Test Invalid Keys:**

- `XX0000` - Invalid key
- `XX9999` - Expired key (for any department prefix)
- Wrong department prefix
- Wrong length

### **Security Features:**

- ✅ 3-attempt limit per session
- ✅ Automatic logout after failed attempts
- ✅ Key expiration simulation
- ✅ Department-specific validation

---

## 🎯 **What to Test**

### **Authentication Flow:**

- [ ] Regular user login (no UniqueKey)
- [ ] Staff member login with UniqueKey
- [ ] Invalid password handling
- [ ] Invalid UniqueKey handling
- [ ] Admin access and features

### **Department Dashboards:**

- [ ] Each department's unique dashboard layout
- [ ] Department-specific features and tools
- [ ] Theme consistency across departments
- [ ] Responsive design on different screen sizes

### **Admin Features:**

- [ ] User management (view, edit, roles)
- [ ] UniqueKey generation and management
- [ ] System analytics and logs
- [ ] Department assignment functionality

### **UI/UX Elements:**

- [ ] Smooth animations and transitions
- [ ] Dark/light mode functionality
- [ ] Mobile responsiveness
- [ ] Accessibility features

---

## 🚀 **Quick Start Commands**

### **Test Admin Access:**

```
Email: admin@jdmarcng.com
Password: admin123
Check Staff Member: YES
Department: Secretariat & Administration
UniqueKey: SA1234
```

### **Test Project Manager:**

```
Email: pm@jdmarcng.com
Password: project123
Check Staff Member: YES
Department: Project Management
UniqueKey: PM2468
```

### **Test Regular User:**

```
Email: user@jdmarcng.com
Password: user123
Check Staff Member: NO
```

---

## 📝 **Notes**

- All accounts are pre-configured for immediate testing
- UniqueKeys are valid for 7 days (simulated)
- Admin can generate new keys and manage all users
- Department themes automatically apply based on user role
- Call system integration works across all dashboards
- Responsive design tested for mobile, tablet, and desktop

**Happy Testing! 🎉**
