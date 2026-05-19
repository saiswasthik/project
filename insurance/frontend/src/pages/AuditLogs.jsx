// import React from 'react';
// import {
//     Search,
//     Download,
//     Filter,
//     ShieldCheck,
//     Lock,
//     Calendar,
//     CheckCircle,
//     XCircle,
//     Info,
//     AlertTriangle,
//     Clock,
//     User,
//     FileText
// } from 'lucide-react';

// const AuditLogs = () => {
//     const [searchQuery, setSearchQuery] = React.useState('');
//     const [selectedAction, setSelectedAction] = React.useState('All Actions');
//     const [selectedOutcome, setSelectedOutcome] = React.useState('All Outcomes');
//     const [selectedDate, setSelectedDate] = React.useState('');

//     const logs = [
//         {
//             date: 'Mar 15, 2024',
//             time: '08:02:18 PM',
//             user: { name: 'Dr. Sarah Chen', role: 'Provider' },
//             action: 'Ran Claim Validation',
//             claimId: 'CLM-2024-0892',
//             outcome: 'Warning',
//             color: 'green',
//             details: 'Automated validation completed with 2 issues found'
//         },
//         {
//             date: 'Mar 15, 2024',
//             time: '07:58:05 PM',
//             user: { name: 'Michael Torres', role: 'Billing Specialist' },
//             action: 'Uploaded Document',
//             claimId: 'CLM-2024-0892',
//             outcome: 'Success',
//             details: 'Discharge summary uploaded (2.4 MB)'
//         },
//         {
//             date: 'Mar 15, 2024',
//             time: '07:45:22 PM',
//             user: { name: 'Emily Rodriguez', role: 'Claims Reviewer' },
//             action: 'Changed Claim Status',
//             claimId: 'CLM-2024-0891',
//             outcome: 'Success',
//             details: "Status changed from 'Pending' to 'In Review'"
//         },
//         {
//             date: 'Mar 15, 2024',
//             time: '05:45:00 PM',
//             user: { name: 'System', role: 'Automated' },
//             action: 'Auto-Validation Triggered',
//             claimId: 'CLM-2024-0890',
//             outcome: 'Failure',
//             details: 'Validation failed: Missing required ICD-10 code'
//         },
//         {
//             date: 'Mar 15, 2024',
//             time: '05:00:25 PM',
//             user: { name: 'James Wilson', role: 'Admin' },
//             action: 'Approved Claim',
//             claimId: 'CLM-2024-0889',
//             outcome: 'Success',
//             details: 'Final approval granted for submission to payer'
//         }
//     ];

//     const filteredLogs = logs.filter(log => {
//         const matchesSearch =
//             log.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//             log.claimId.toLowerCase().includes(searchQuery.toLowerCase()) ||
//             log.details.toLowerCase().includes(searchQuery.toLowerCase());

//         const matchesAction = selectedAction === 'All Actions' || log.action === selectedAction;
//         const matchesOutcome = selectedOutcome === 'All Outcomes' || log.outcome === selectedOutcome;
//         const matchesDate = !selectedDate || log.date.includes(selectedDate); // Simple string match for demo

//         return matchesSearch && matchesAction && matchesOutcome && matchesDate;
//     });

//     const badgeStyles = {
//         Success: "bg-green-100 text-black border border-black badge-success",
//         Failure: "bg-red-100 text-red-700 border border-red-200 badge-danger",
//         Warning: "bg-orange-100 text-black border border-orange-200 badge-warning",
//         Info: "bg-blue-100 text-blue-700 border border-blue-200 badge-info",
//     };


//     const getOutcomeBadge = (outcome) => (
//         <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${badgeStyles[outcome] || badgeStyles.Info}`}>
//             {outcome === "Success" && <CheckCircle size={12} />}
//             {outcome === "Failure" && <XCircle size={12} />}
//             {outcome === "Warning" && <AlertTriangle size={12} />}
//             {outcome === "Info" && <Info size={12} />}
//             {outcome}
//         </span>
//     );


//     return (
//         <div>
//             {/* Header */}
//             <div className="flex justify-between items-start mb-6">
//                 <div>
//                     <div className="flex items-center gap-3 mb-1">
//                         <h1 className="text-2xl font-bold text-slate-800">Audit Logs</h1>
//                         <div className="flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-medium border border-slate-200">
//                             <Lock size={10} />
//                             Read-Only
//                         </div>
//                     </div>
//                     <p className="text-sm text-slate-500">HIPAA-compliant activity log • All actions are permanently recorded</p>
//                 </div>
//                 <button className="btn btn-outline gap-2 bg-white text-sm">
//                     <Download size={16} />
//                     Export Logs
//                 </button>
//             </div>

//             {/* Compliance Message */}
//             <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8 flex items-start gap-3">
//                 <ShieldCheck size={20} className="text-blue-600 mt-0.5" />
//                 <div>
//                     <h3 className="font-semibold text-blue-900 text-sm">Insurance Compliance Record</h3>
//                     <p className="text-xs text-blue-700 mt-1 leading-relaxed">
//                         This audit trail is maintained in accordance with HIPAA regulations and insurance industry compliance requirements.
//                         All entries are immutable and timestamped with cryptographic verification. Retention period: 7 years.
//                     </p>
//                 </div>
//             </div>

//             {/* Filters */}
//             <div className="card p-4 mb-6">
//                 {/* Header Row */}
//                 <div className="flex items-center gap-2 mb-4">
//                     <Filter size={16} className="text-slate-700" />
//                     <h3 className="text-sm font-bold text-slate-700">Filter Logs</h3>
//                 </div>

//                 {/* Inputs Row - Flexbox for guaranteed side-by-side */}
//                 <div className="flex items-center gap-4 w-full">
//                     <div className="relative flex-[2]">
//                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
//                         <input
//                             type="text"
//                             placeholder="Search by user, claim ID, or details..."
//                             className="input pl-10 h-10 text-sm border-slate-200 w-full"
//                             value={searchQuery}
//                             onChange={(e) => setSearchQuery(e.target.value)}
//                         />
//                     </div>
//                     <div className="flex-1">
//                         <select
//                             className="input h-10 text-sm text-slate-600 border-slate-200 bg-white cursor-pointer hover:border-slate-300 transition-colors w-full"
//                             value={selectedAction}
//                             onChange={(e) => setSelectedAction(e.target.value)}
//                         >
//                             <option>All Actions</option>
//                             <option>Ran Claim Validation</option>
//                             <option>Uploaded Document</option>
//                             <option>Changed Claim Status</option>
//                             <option>Auto-Validation Triggered</option>
//                             <option>Approved Claim</option>
//                         </select>
//                     </div>
//                     <div className="flex-1">
//                         <select
//                             className="input h-10 text-sm text-slate-600 border-slate-200 bg-white cursor-pointer hover:border-slate-300 transition-colors w-full"
//                             value={selectedOutcome}
//                             onChange={(e) => setSelectedOutcome(e.target.value)}
//                         >
//                             <option>All Outcomes</option>
//                             <option>Success</option>
//                             <option>Failure</option>
//                             <option>Warning</option>
//                         </select>
//                     </div>
//                     <div className="relative flex-1">
//                         <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} style={{ display: "flex", justifyContent: "center", alignItems: "center", direction: "ltr" }} />
//                         <input
//                             type="text"
//                             placeholder="mm/dd/yyyy"
//                             className="input pl-10 h-10 text-sm border-slate-200 cursor-pointer w-full"
//                             value={selectedDate}
//                             onChange={(e) => setSelectedDate(e.target.value)}
//                         />
//                     </div>
//                 </div>
//             </div>

//             {/* Table */}
//             <div className="card p-0 overflow-hidden border border-slate-200 shadow-sm">
//                 <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white">
//                     <h3 className="font-bold text-slate-800 text-sm">Activity Log</h3>
//                     <span className="text-xs text-slate-400">{filteredLogs.length} entries found</span>
//                 </div>
//                 <div className="overflow-x-auto">
//                     <table className="w-full text-left border-collapse">
//                         <thead className="bg-[#f8fafc] border-b border-slate-100">
//                             <tr>
//                                 <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-48">
//                                     <div className="flex items-center gap-2">
//                                         <Clock size={14} />
//                                         Timestamp
//                                     </div>
//                                 </th>
//                                 <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-48">
//                                     <div className="flex items-center gap-2">
//                                         <User size={14} />
//                                         User
//                                     </div>
//                                 </th>
//                                 <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
//                                 <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
//                                     <div className="flex items-center gap-2">
//                                         <FileText size={14} />
//                                         Claim ID
//                                     </div>
//                                 </th>
//                                 <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Outcome</th>
//                                 <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Details</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-slate-50 bg-white">
//                             {filteredLogs.map((log, idx) => (
//                                 <tr key={idx} className="hover:bg-slate-50 transition-colors">
//                                     <td className="px-6 py-4 whitespace-nowrap">
//                                         <div className="text-sm font-semibold text-slate-700">{log.date}</div>
//                                         <div className="text-xs text-slate-400 font-medium uppercase mt-0.5">{log.time}</div>
//                                     </td>
//                                     <td className="px-6 py-4">
//                                         <div className="text-sm font-medium text-slate-800">{log.user.name}</div>
//                                         <div className="text-xs text-slate-500">{log.user.role}</div>
//                                     </td>
//                                     <td className="px-6 py-4">
//                                         <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-white border border-slate-200 text-slate-600 shadow-sm">
//                                             {log.action}
//                                         </span>
//                                     </td>
//                                     <td className="px-6 py-4 text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
//                                         {log.claimId}
//                                     </td>
//                                     <td className="px-6 py-4">
//                                         {getOutcomeBadge(log.outcome)}
//                                     </td>
//                                     <td className="px-6 py-4 text-sm text-slate-500 truncate max-w-xs">
//                                         {log.details}
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AuditLogs;
