
import { motion } from 'framer-motion';

function StarCardtDeshbord({ title, value, subtitle, icon, delay }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3, delay }}
            className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-300 group cursor-pointer"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-white text-sm font-medium">{title}</h2>
                    <p className="text-2xl font-bold text-white mt-2">{value}</p>
                    <p className="text-gray-400 text-xs mt-1">{subtitle}</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-purple-600 to-purple-600/30 hover:from-purple-600/40 hover:to-purple-600/50 rounded-xl">
                    <div className="text-white text-xl">
                        {icon}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
export default StarCardtDeshbord