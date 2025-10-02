
'use client';

import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiDollarSign, } from "react-icons/fi";
import AdminLoading from './AdminLoading';

export default function UniversalTable({
    data = [],
    columns = [],
    actions = [],
    emptyMessage = "No data found",
    emptyDescription = "Try adjusting your search or filters",
    loading = false,
    className = ""
}) {

    // Default empty state icon
    const EmptyIcon = columns[0]?.emptyIcon || FiCalendar;

    if (loading) return <AdminLoading />

    if (!data || data.length === 0) {
        return (
            <div className="bg-gradient-to-br from-gray-900 to-gray-900/55 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
                <div className="text-center py-12">
                    <EmptyIcon className="mx-auto text-4xl text-gray-600 mb-4" />
                    <p className="text-gray-400 text-lg">{emptyMessage}</p>
                    <p className="text-gray-500 text-sm">{emptyDescription}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-gradient-to-br from-gray-900 to-gray-900/55 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden ${className}`}>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-900/50">
                        <tr>
                            {columns.map((column, index) => (
                                <th
                                    key={index}
                                    className="text-left py-4 px-6 text-gray-400 font-semibold text-sm uppercase tracking-wider"
                                    style={{ width: column.width }}
                                >
                                    {column.header}
                                </th>
                            ))}
                            {actions.length > 0 && (
                                <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm uppercase tracking-wider">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {data.map((item, index) => (
                            <TableRow
                                key={item._id || item.id || index}
                                item={item}
                                index={index}
                                columns={columns}
                                actions={actions}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// Individual Table Row Component
function TableRow({ item, index, columns, actions }) {
    return (
        <motion.tr
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="hover:bg-gray-800/30 transition-colors"
        >
            {/* Render Columns */}
            {columns.map((column, colIndex) => (
                <td key={colIndex} className="py-4 px-6">
                    <ColumnRenderer
                        item={item}
                        column={column}
                    />
                </td>
            ))}

            {/* Render Actions */}
            {actions.length > 0 && (
                <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                        {actions.map((action, actionIndex) => (
                            <ActionButton
                                key={actionIndex}
                                action={action}
                                item={item}
                            />
                        ))}
                    </div>
                </td>
            )}
        </motion.tr>
    );
}

// Column Renderer Component
function ColumnRenderer({ item, column }) {
    const { key, render, type = 'text' } = column;

    // Custom render function
    if (render) {
        return render(item);
    }

    const value = item[key];

    // Default renderers based on type
    switch (type) {
        case 'currency':
            return (
                <div className="flex items-center space-x-2">
                    <FiDollarSign className="text-green-400" />
                    <span className="text-white font-bold">${value}</span>
                </div>
            );

        case 'date':
            return (
                <div className="flex items-center space-x-2">
                    <FiCalendar className="text-purple-400 text-sm" />
                    <span className="text-white text-sm">
                        {new Date(value).toLocaleDateString()}
                    </span>
                </div>
            );

        case 'datetime':
            return (
                <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                        <FiCalendar className="text-purple-400 text-sm" />
                        <span className="text-white text-sm">
                            {new Date(value).toLocaleDateString()}
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <FiClock className="text-blue-400 text-sm" />
                        <span className="text-gray-400 text-sm">
                            {item.showTime || new Date(value).toLocaleTimeString()}
                        </span>
                    </div>
                </div>
            );

        case 'status':
            const statusConfig = column.statusConfig || {};
            const statusValue = value || item.status;
            const statusStyle = statusConfig[statusValue] || statusConfig.default ||
                'bg-gray-500/20 text-gray-400 border-gray-500/30';

            return (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusStyle}`}>
                    {column.statusIcons?.[statusValue] || column.statusIcons?.default}
                    <span className="ml-1 capitalize">{statusValue}</span>
                </span>
            );

        case 'badge':
            return (
                <div className="flex flex-wrap gap-1">
                    {Array.isArray(value) ? value.map((badge, idx) => (
                        <span
                            key={idx}
                            className="px-2 py-1 bg-gray-700 text-white text-xs rounded"
                        >
                            {badge}
                        </span>
                    )) : (
                        <span className="px-2 py-1 bg-gray-700 text-white text-xs rounded">
                            {value}
                        </span>
                    )}
                </div>
            );

        case 'avatar':
            return (
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-14 bg-gray-700 rounded-lg flex items-center justify-center">
                        {column.avatarIcon || <FiCalendar className="text-gray-400" />}
                    </div>
                    <div>
                        <p className="text-white font-medium">{value}</p>
                        <p className="text-gray-400 text-sm">{column.subtitle ? item[column.subtitle] : ''}</p>
                    </div>
                </div>
            );

        default:
            return <span className="text-white">{value}</span>;
    }
}

// Action Button Component
function ActionButton({ action, item }) {
    const {
        icon,
        onClick,
        title,
        color = 'blue',
        variant = 'icon'
    } = action;

    const colorClasses = {
        blue: 'text-blue-400 hover:bg-blue-500/20',
        green: 'text-green-400 hover:bg-green-500/20',
        red: 'text-red-400 hover:bg-red-500/20',
        yellow: 'text-yellow-400 hover:bg-yellow-500/20',
        purple: 'text-purple-400 hover:bg-purple-500/20'
    };

    const handleClick = () => {
        if (onClick) {
            onClick(item);
        }
    };

    if (variant === 'text') {
        return (
            <button
                onClick={handleClick}
                className={`px-3 py-1 rounded-lg transition-colors ${colorClasses[color]}`}
                title={title}
            >
                {icon && <span className="mr-1">{icon}</span>}
                {title}
            </button>
        );
    }

    return (
        <button
            onClick={handleClick}
            className={`p-2 rounded-lg transition-colors ${colorClasses[color]}`}
            title={title}
        >
            {icon}
        </button>
    );
}