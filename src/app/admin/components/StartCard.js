import { motion, AnimatePresence } from 'framer-motion';

function StatCard({ title, value, subtitle, icon, color }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-gradient-to-br ${color} p-6 rounded-2xl shadow-lg border border-white/10`}
        >
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-white/80 text-sm font-medium">{title}</h2>
                    <p className="text-2xl font-bold text-white mt-2">{value}</p>
                    <p className="text-white/60 text-xs mt-1">{subtitle}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <div className="text-white text-xl">
                        {icon}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default StatCard