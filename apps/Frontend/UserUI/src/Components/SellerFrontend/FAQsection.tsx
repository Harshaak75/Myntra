import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/Components/ui/accordion";

export function FAQsection(){
  const faqs = [
    {
      question: "How much does it cost to sell on Meesho?",
      answer: "It's completely free to list and sell products on Meesho. We do not charge any commission on your sales, unlike other marketplaces."
    },
    {
      question: "What products can I sell on Meesho?",
      answer: "You can sell products across various categories including Fashion, Home & Kitchen, Beauty & Personal Care, Electronics, and more. However, certain products are prohibited as per our policies."
    },
    {
      question: "How do I get paid for my sales?",
      answer: "Payments are processed regularly to your registered bank account. The payment cycle is typically 7-15 days after order delivery, depending on your seller tier."
    },
    {
      question: "How do returns work on Meesho?",
      answer: "When a customer initiates a return, you'll be notified. Once the product is received back in good condition, the return is processed. Meesho has one of the lowest return rates in the industry."
    },
    {
      question: "What kind of support does Meesho provide to suppliers?",
      answer: "Meesho provides dedicated account management, business growth insights, marketing opportunities, and technical support to help you grow your business on our platform."
    },
    {
      question: "How is shipping handled?",
      answer: "You can use Meesho's logistics partners at negotiated rates or your own shipping methods. The shipping costs are calculated based on product weight and delivery location."
    }
  ];

  return (
    <section id="faq" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#333333] mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about selling on Meesho.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full ">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-medium cursor-pointer">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};