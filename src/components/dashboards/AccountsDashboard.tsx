import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DollarSign,
  FileText,
  TrendingUp,
  Download,
  Calculator,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Clock,
  PieChart,
  Receipt,
  Banknote,
} from "lucide-react";

interface Invoice {
  id: string;
  client: string;
  project: string;
  amount: string;
  status: "pending" | "paid" | "overdue";
  dueDate: string;
  invoiceDate: string;
}

interface Expense {
  id: string;
  category: string;
  description: string;
  amount: string;
  status: "pending" | "approved" | "rejected";
  submittedBy: string;
  date: string;
}

export default function AccountsDashboard() {
  const [invoices] = useState<Invoice[]>([
    {
      id: "INV-001",
      client: "Lagos State Government",
      project: "Smart City Infrastructure",
      amount: "$750,000",
      status: "pending",
      dueDate: "2024-02-15",
      invoiceDate: "2024-01-15",
    },
    {
      id: "INV-002",
      client: "Zenith Bank",
      project: "Office Complex",
      amount: "$320,000",
      status: "paid",
      dueDate: "2024-01-30",
      invoiceDate: "2024-01-01",
    },
    {
      id: "INV-003",
      client: "Federal Housing Authority",
      project: "Residential Development",
      amount: "$480,000",
      status: "overdue",
      dueDate: "2024-01-20",
      invoiceDate: "2023-12-20",
    },
  ]);

  const [expenses] = useState<Expense[]>([
    {
      id: "EXP-001",
      category: "Materials",
      description: "Concrete and Steel supplies",
      amount: "$45,000",
      status: "pending",
      submittedBy: "John Doe",
      date: "2024-01-15",
    },
    {
      id: "EXP-002",
      category: "Equipment",
      description: "Crane rental for 2 weeks",
      amount: "$8,500",
      status: "approved",
      submittedBy: "Jane Smith",
      date: "2024-01-14",
    },
    {
      id: "EXP-003",
      category: "Labor",
      description: "Additional workforce overtime",
      amount: "$12,000",
      status: "pending",
      submittedBy: "Mike Johnson",
      date: "2024-01-13",
    },
  ]);

  const [stats] = useState({
    totalRevenue: "$2.8M",
    pendingInvoices: "$1.2M",
    monthlyExpenses: "$450K",
    profitMargin: "28%",
  });

  const getInvoiceStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "overdue":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getExpenseStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#142E54] to-[#F97316] rounded-xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Accounts Department</h1>
            <p className="text-blue-100">
              Financial tracking, invoicing, and budget management
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-4">
            <DollarSign className="h-12 w-12 text-white/80" />
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Revenue
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalRevenue}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Pending Invoices
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.pendingInvoices}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <FileText className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Monthly Expenses
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.monthlyExpenses}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <CreditCard className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Profit Margin
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.profitMargin}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <PieChart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Invoice Management */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Receipt className="h-5 w-5 text-[#F97316]" />
                    Invoice Management
                  </CardTitle>
                  <CardDescription>
                    Track client invoices and payment status
                  </CardDescription>
                </div>
                <Button className="bg-[#F97316] hover:bg-[#F97316]/90">
                  <FileText size={16} className="mr-2" />
                  New Invoice
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-[#F97316] transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {invoice.id}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {invoice.client}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {invoice.project}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge
                          className={`${getInvoiceStatusColor(invoice.status)} mb-2`}
                        >
                          {invoice.status.charAt(0).toUpperCase() +
                            invoice.status.slice(1)}
                        </Badge>
                        <p className="text-lg font-bold text-gray-900">
                          {invoice.amount}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-4">
                        <span>
                          Issued:{" "}
                          {new Date(invoice.invoiceDate).toLocaleDateString()}
                        </span>
                        <span>
                          Due: {new Date(invoice.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Download size={14} className="mr-1" />
                          Download
                        </Button>
                        <Button
                          size="sm"
                          className="bg-[#F97316] hover:bg-[#F97316]/90"
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Expense Tracking */}
          <Card className="border-0 shadow-lg mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-[#F97316]" />
                Expense Approvals
              </CardTitle>
              <CardDescription>
                Review and approve submitted expenses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {expense.category}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {expense.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Submitted by {expense.submittedBy} •{" "}
                          {new Date(expense.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge
                          className={`${getExpenseStatusColor(expense.status)} mb-2`}
                        >
                          {expense.status.charAt(0).toUpperCase() +
                            expense.status.slice(1)}
                        </Badge>
                        <p className="font-bold text-gray-900">
                          {expense.amount}
                        </p>
                      </div>
                    </div>
                    {expense.status === "pending" && (
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle size={14} className="mr-1" />
                          Approve
                        </Button>
                        <Button size="sm" variant="outline">
                          <AlertCircle size={14} className="mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Financial Tools */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* Budget Summary */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-[#F97316]" />
                Budget Summary
              </CardTitle>
              <CardDescription>Current month overview</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Revenue</span>
                  <span className="font-medium text-green-600">+$850K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Expenses</span>
                  <span className="font-medium text-red-600">-$450K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Materials</span>
                  <span className="font-medium text-red-600">-$280K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Labor</span>
                  <span className="font-medium text-red-600">-$120K</span>
                </div>
                <hr />
                <div className="flex justify-between">
                  <span className="font-medium">Net Profit</span>
                  <span className="font-bold text-green-600">$400K</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Invoice Templates */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5 text-[#F97316]" />
                Invoice Templates
              </CardTitle>
              <CardDescription>
                Download pre-formatted templates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <FileText size={16} className="mr-2" />
                Standard Invoice Template
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Receipt size={16} className="mr-2" />
                Project Invoice Template
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Banknote size={16} className="mr-2" />
                Expense Report Template
              </Button>
            </CardContent>
          </Card>

          {/* Payment Tracker */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#F97316]" />
                Payment Tracker
              </CardTitle>
              <CardDescription>Recent payment activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="text-sm font-medium">Zenith Bank</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                  <span className="text-green-600 font-medium">+$320K</span>
                </div>
                <div className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="text-sm font-medium">Material Supplier</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                  <span className="text-red-600 font-medium">-$45K</span>
                </div>
                <div className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="text-sm font-medium">Equipment Rental</p>
                    <p className="text-xs text-gray-500">3 days ago</p>
                  </div>
                  <span className="text-red-600 font-medium">-$8.5K</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
