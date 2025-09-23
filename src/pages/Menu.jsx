import React from 'react';

const Menu = ({ onAddToCart }) => {
    const menuItems = [
        // Extracted from your images
        { id: 1, name: "NEW* Tofu Peanut Satay", price: 13.75, image: "https://images.unsplash.com/photo-1559606233-132d04555533?q=80&w=2897&auto=format&fit=crop" },
        { id: 2, name: "Mulligatawny Stew", price: 14.25, image: "https://images.unsplash.com/photo-1604909052138-0813584550e5?q=80&w=2960&auto=format&fit=crop" },
        { id: 3, name: "BBQ Mashed Potato Bowl", price: 12.50, image: "https://images.unsplash.com/photo-1590423194455-33139f73369a?q=80&w=2960&auto=format&fit=crop" },
        { id: 4, name: "Smashed Cucumbers", price: 7.00, image: "https://images.unsplash.com/photo-1628791242261-2943365313a4?q=80&w=2960&auto=format&fit=crop" },
        { id: 5, name: "Curried Chix Salad", price: 8.00, image: "https://images.unsplash.com/photo-1543339308-43e59d6b70a6?q=80&w=2940&auto=format&fit=crop" },
        { id: 6, name: "Pasta Puttanesca", price: 13.00, image: "https://images.unsplash.com/photo-1621996346565-e326e7e24c26?q=80&w=2940&auto=format&fit=crop" },
        { id: 7, name: "Waldorf Salad", price: 7.75, image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=2960&auto=format&fit=crop" },
        { id: 8, name: "NEW* Cumin Quinoa", price: 4.25, image: "https://images.unsplash.com/photo-1565599243411-4a141fee5f1a?q=80&w=2960&auto=format&fit=crop" },
        { id: 9, name: "Roasted Potatoes", price: 10.00, image: "https://images.unsplash.com/photo-1617093861353-86ec33c38985?q=80&w=2960&auto=format&fit=crop" },
        { id: 10, name: "Baked Teriyaki Tofu *BULK", price: 13.00, image: "https://images.unsplash.com/photo-1589301760014-d929f39791e8?q=80&w=2940&auto=format&fit=crop" },
        { id: 11, name: "African Lentil Soup (Frozen)", price: 14.00, image: "https://images.unsplash.com/photo-1626372416458-7423d5313339?q=80&w=2960&auto=format&fit=crop" },
        { id: 12, name: "Black Eyed Pea's (Frozen)", price: 13.00, image: "https://images.unsplash.com/photo-1605379328498-c3a502d2fa83?q=80&w=2960&auto=format&fit=crop" },
        { id: 13, name: "Broccoli Cheese Soup (Frozen)", price: 14.00, image: "https://images.unsplash.com/photo-1472506903867-821b72a536d4?q=80&w=2960&auto=format&fit=crop" },
        { id: 14, name: "Burmese Samosa Soup (Frozen)", price: 13.25, image: "https://images.unsplash.com/photo-1569058242253-92a9c555a06c?q=80&w=2960&auto=format&fit=crop" },
        { id: 15, name: "Carrot Curry Bisque (Frozen)", price: 13.50, image: "https://images.unsplash.com/photo-1542691459-f2430159b562?q=80&w=2960&auto=format&fit=crop" },
        { id: 16, name: "Chorizo Burrito (Frozen)", price: 10.00, image: "https://images.unsplash.com/photo-1625220194771-7ebdea0d3629?q=80&w=2960&auto=format&fit=crop" },
        { id: 17, name: "Coconut Curry Lentils (Frozen)", price: 12.00, image: "https://images.unsplash.com/photo-1585237623922-354395a12930?q=80&w=2960&auto=format&fit=crop" },
        { id: 18, name: "Golden Coco Lentil (Frozen)", price: 14.50, image: "https://images.unsplash.com/photo-1605379328498-c3a502d2fa83?q=80&w=2960&auto=format&fit=crop" },
        { id: 19, name: "Lasagna Soup (Frozen)", price: 12.50, image: "https://images.unsplash.com/photo-1580958162828-e819b88a4034?q=80&w=2960&auto=format&fit=crop" },
        { id: 20, name: "Loaded Potato Chowder (Frozen)", price: 14.25, image: "https://images.unsplash.com/photo-1617093861353-86ec33c38985?q=80&w=2960&auto=format&fit=crop" },
        { id: 21, name: "Pesto Sweet Potato Lasagna (Frozen)", price: 27.00, image: "https://images.unsplash.com/photo-1574894709920-31b29d1dc400?q=80&w=2960&auto=format&fit=crop" },
        { id: 22, name: "Pozole Rojo (Frozen)", price: 13.25, image: "https://images.unsplash.com/photo-1598515213692-5f2841443497?q=80&w=2960&auto=format&fit=crop" },
        { id: 23, name: "Roasted Corn Chowder (Frozen)", price: 13.00, image: "https://images.unsplash.com/photo-1604909052138-0813584550e5?q=80&w=2960&auto=format&fit=crop" },
        { id: 24, name: "Rustic Tomato Basil (Frozen)", price: 14.00, image: "https://images.unsplash.com/photo-1595732282823-851543883b27?q=80&w=2960&auto=format&fit=crop" },
        { id: 25, name: "Samosa Burrito (Frozen)", price: 10.00, image: "https://images.unsplash.com/photo-1565299712540-6eb5a8247f0d?q=80&w=2960&auto=format&fit=crop" },
        { id: 26, name: "Sausage and Lentil Soup (Frozen)", price: 14.25, image: "https://images.unsplash.com/photo-1518492193386-7454c93ac212?q=80&w=2960&auto=format&fit=crop" },
        { id: 27, name: "Sloppy Joe MIX (Frozen)", price: 15.00, image: "https://images.unsplash.com/photo-1607290518353-8f334a1a3b40?q=80&w=2960&auto=format&fit=crop" },
        { id: 28, name: "Sweet Potato Dahl (Frozen)", price: 13.00, image: "https://images.unsplash.com/photo-1604909052138-0813584550e5?q=80&w=2960&auto=format&fit=crop" },
        { id: 29, name: "Sweet Potato Tomatillo (Frozen)", price: 13.00, image: "https://images.unsplash.com/photo-1604909052138-0813584550e5?q=80&w=2960&auto=format&fit=crop" },
        { id: 30, name: "Tom Kha (Frozen)", price: 15.00, image: "https://images.unsplash.com/photo-1574484284002-968d92f52912?q=80&w=2960&auto=format&fit=crop" },
        { id: 31, name: "Veggie Ziti (Frozen)", price: 24.00, image: "https://images.unsplash.com/photo-1621996346565-e326e7e24c26?q=80&w=2940&auto=format&fit=crop" },
        { id: 32, name: "Zuppa Toscana (Frozen)", price: 14.00, image: "https://images.unsplash.com/photo-1518492193386-7454c93ac212?q=80&w=2960&auto=format&fit=crop" },
        { id: 33, name: "Rhubarb Vinaigrette NEW", price: 10.00, image: "https://images.unsplash.com/photo-1557800182-3a53a63a7acd?q=80&w=2960&auto=format&fit=crop" },
        { id: 34, name: "Tica Sauce", price: 10.00, image: "https://images.unsplash.com/photo-1548247631-4a53e7a18833?q=80&w=2960&auto=format&fit=crop" },
        { id: 35, name: "Vegan Walnut Pesto", price: 9.00, image: "https://images.unsplash.com/photo-1606390169249-f46334648d8f?q=80&w=2960&auto=format&fit=crop" },
        { id: 36, name: "FRESH Vegetable Broth", price: 8.00, image: "https://images.unsplash.com/photo-1549978793-2a78d22ac145?q=80&w=2960&auto=format&fit=crop" },
        { id: 37, name: "NEW* Kelly's Greens Cookies", price: 5.00, image: "https://images.unsplash.com/photo-1598851312975-61e3ef326b89?q=80&w=2960&auto=format&fit=crop" },
        { id: 38, name: "Yes Kween-GF Cookie", price: 8.00, image: "https://images.unsplash.com/photo-1598851312975-61e3ef326b89?q=80&w=2960&auto=format&fit=crop" },
        { id: 39, name: "Fudgy Oreo Flatty", price: 8.00, image: "https://images.unsplash.com/photo-1598851312975-61e3ef326b89?q=80&w=2960&auto=format&fit=crop" },
    ];
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16">This Week's Menu</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {menuItems.map(item => (
                        <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transform hover:-translate-y-2 transition-transform duration-300">
                            <img src={item.image} alt={item.name} className="w-full h-56 object-cover" />
                            <div className="p-6 flex flex-col flex-grow">
                                <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                                <p className="text-lg font-semibold text-green-600 mb-4">${item.price.toFixed(2)}</p>
                                <button onClick={() => onAddToCart(item)} className="mt-auto w-full bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors duration-300">
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Menu;