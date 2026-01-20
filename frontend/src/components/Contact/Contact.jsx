const Contact = () => {
    return (
        <div className="flex min-h-screen bg-white overflow-hidden flex-col md:flex-row">

            {/* IZQUIERDA */}
            <div className="w-full  md:w-1/2 flex flex-col justify-center px-8 md:px-16 py-12 bg-white">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
                    Contáctenos
                </h1>

                <p className="mt-4 max-w-md text-sm md:text-base text-gray-600">
                    Escríbenos para resolver dudas, sugerencias o propuestas.
                </p>
                <div className="space-y-6 mt-8 ">
                    

                    {/* DIRECCIÓN */}
                    <div className="flex items-start gap-3">
                        <div className="bg-teal-100 p-2 rounded-lg shrink-0">
                            <svg
                                className="w-6 h-6 text-teal-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                        </div>

                        <div>
                            <h4 className="font-semibold text-gray-800">Oficina ADAMA</h4>
                            <p className="text-gray-600 text-sm">
                                Carrera 8 # 7-38, Segundo piso
                            </p>
                            <p className="text-gray-600 text-sm">
                                Garzón - Huila, Colombia
                            </p>
                        </div>
                    </div>

                    {/* CORREO */}
                    <div className="flex items-start gap-3">
                        <div className="bg-teal-100 p-2 rounded-lg shrink-0">
                            <svg
                                className="w-6 h-6 text-teal-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                    d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                                />
                            </svg>
                        </div>

                        <div>
                            <h4 className="font-semibold text-gray-800">Envíanos un correo</h4>
                            <p className="text-gray-600 text-sm">adama@gmail.com</p>
                            <p className="text-gray-600 text-sm">ecoitsuport@gmail.com</p>
                        </div>
                    </div>

                    {/* TELÉFONO */}
                    <div className="flex items-start gap-3">
                        <div className="bg-teal-100 p-2 rounded-lg shrink-0">
                            <svg
                                className="w-6 h-6 text-teal-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                    d="M20.25 3.75v4.5m0-4.5h-4.5m4.5 0-6 6m3 12c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 0 1 4.5 2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44-.054.902-.417 1.173l-1.293.97a1.062 1.062 0 0 0-.38 1.21 12.035 12.035 0 0 0 7.143 7.143c.441.162.928-.004 1.21-.38l.97-1.293a1.125 1.125 0 0 1 1.173-.417l4.423 1.106c.5.125.852.575.852 1.091V19.5a2.25 2.25 0 0 1-2.25 2.25h-2.25Z"
                                />
                            </svg>
                        </div>

                        <div>
                            <h4 className="font-semibold text-gray-800">Llámanos</h4>
                            <p className="text-gray-600 text-sm">312 188 144</p>
                            <p className="text-gray-600 text-sm">189 417 810</p>
                        </div>
                    </div>

                </div>
            </div>

            {/* DERECHA */}
            <div className="w-full md:w-1/2 flex items-center justify-center px-4 sm:px-8 py-12 bg-white">
                <div className="w-full max-w-lg">

                    <div className="bg-gradient-to-r from-teal-50 to-teal-100 rounded-2xl shadow-xl p-6 border border-gray-100">

                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-teal-700 to-teal-400 bg-clip-text text-transparent mb-6">
                            Escríbenos
                        </h2>

                        <form className="space-y-5">

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre completo
                                </label>
                                <input
                                    type="text"
                                    placeholder="Juan Pérez"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Correo electrónico
                                </label>
                                <input
                                    type="email"
                                    placeholder="correo@email.com"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mensaje
                                </label>
                                <textarea
                                    rows="4"
                                    placeholder="Escribe tu mensaje aquí..."
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition resize-none"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-gradient-to-r from-teal-600 to-teal-400 text-white font-semibold rounded-lg hover:from-teal-500 hover:to-teal-700 transition"
                            >
                                Enviar mensaje
                            </button>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
