import React from 'react';
 // 1. Import the new component

const ProfilePage = () => {
    return (
        <>
            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-6 lg:px-8 max-w-4xl">
                    <h1 className="text-4xl font-bold text-brand-gray mb-8">My Profile</h1>
                    <div className="space-y-12">
                        <OrderHistory /> {/* 2. Add the component here */}
                        <ProfileDetails />
                        <UpdatePassword />
                        <SavedAddresses />
                        <div>
                            <h2 className="text-2xl font-bold text-brand-gray border-b pb-2 mb-4">Saved Cards</h2>
                            <p className="text-gray-500">Feature coming soon!</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default ProfilePage;