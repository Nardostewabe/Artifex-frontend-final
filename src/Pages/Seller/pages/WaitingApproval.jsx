import React from 'react';

const WaitingApproval = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen w-screen bg-gradient-to-br from-[#bfdbfe] to-[#e9d5ff] flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="font-serif text-5xl md:text-7xl text-gray-800 mb-6">
            Waiting <br /> for Approval.
          </h1>
          <p className="text-gray-700 text-lg md:text-xl tracking-wide max-w-lg mx-auto mb-8">
            Your shop is under review, you will recieve a response and if approved you can log in.Thank you for your patience.
          </p>
        </div>
      </section>
    </div>
  );
};

export default WaitingApproval;