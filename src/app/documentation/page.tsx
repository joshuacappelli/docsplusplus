import React from "react";
import { Header3 } from "@/components/ui/header";

const DocumentationPage: React.FC = () => {
    return (
        <div className="documentation-page min-h-screen bg-[#fdf5e6] text-gray-800">
        <Header3 />

            {/* Main Content */}
            <main className="content py-12">
                <div className="container mx-auto px-4 space-y-12">
                    <section id="heading" className="bg-white shadow-md p-6 rounded-md">
                        <h2 className="text-2xl font-semibold text-sageGreen mb-4">Heading</h2>
                        <p>Choose the desired heading level (h1 to h6) and enter the corresponding text that you would like to associate with it.</p>
                    </section>

                    <section id="text-format" className="bg-white shadow-md p-6 rounded-md">
                        <h2 className="text-2xl font-semibold text-sageGreen mb-4">Text Format</h2>
                        <p>Select the desired text formatting style from the options provided, and then input the text you wish to format accordingly.</p>
                    </section>

                    <section id="image" className="bg-white shadow-md p-6 rounded-md">
                        <h2 className="text-2xl font-semibold text-sageGreen mb-4">Image</h2>
                        <p>To add an image, first provide a brief description of the image without any spaces. After the description, insert a space followed by the URL of the image you wish to include.</p>
                    </section>

                    <section id="quote" className="bg-white shadow-md p-6 rounded-md">
                        <h2 className="text-2xl font-semibold text-sageGreen mb-4">Quote</h2>
                        <p>To add a quote, simply write the quote.</p>
                    </section>

                    <section id="breakline" className="bg-white shadow-md p-6 rounded-md">
                        <h2 className="text-2xl font-semibold text-sageGreen mb-4">Quote</h2>
                        <p>For breaklines after selecting it just place one space and add the block.</p>
                    </section>

                    <section id="table" className="bg-white shadow-md p-6 rounded-md">
                        <h2 className="text-2xl font-semibold text-sageGreen mb-4">Table</h2>
                        <p>To create a table, start by defining the headers in the first row. Each header should be separated by a space. For subsequent rows, enter the data corresponding to each header, ensuring that each entry is also separated by a space. Make sure to start a new line for each row of data to properly format the table.</p>
                    </section>

                    <section id="AI" className="bg-white shadow-md p-6 rounded-md">
                        <h2 className="text-2xl font-semibold text-sageGreen mb-4">AI</h2>
                        <p>The AI feature is designed to assist you with various text and code formats, enabling you to summarize content effectively. Additionally, it can help you create tables effortlessly. To use this feature for tables, simply list all your column headers followed by their corresponding data, ensuring that each entry is separated by a space. The AI will then automatically reformat the information into a properly structured table.</p>
                    </section>
                </div>
            </main>

            {/* Footer Section */}
            <footer className="bg-gray-800 text-white py-6">
                <div className="container mx-auto px-4 text-center">
                    <p>2025 DocPlusPlus</p>
                </div>
            </footer>
        </div>
    );
};

export default DocumentationPage;
