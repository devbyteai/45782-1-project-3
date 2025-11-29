export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm">✈</span>
                        </div>
                        <div>
                            <span className="font-semibold text-gray-900">Vacations</span>
                            <span className="text-gray-400 text-sm ml-2 hidden sm:inline">Discover your next adventure</span>
                        </div>
                    </div>
                    <div className="text-sm text-gray-500">
                        © {currentYear} Vacation Tagging System. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
}
