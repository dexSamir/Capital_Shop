"use client"

import { useState } from "react"
import { FaChevronDown, FaChevronUp } from "react-icons/fa"
import "./FAQ.scss"

interface FAQItem {
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    question: "How do I track my order?",
    answer:
      "You can track your order by clicking on the 'Track Your Order' link in the navigation bar. Enter your order number and email address to see the current status of your shipment.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We accept returns within 30 days of purchase. Items must be unused, unworn, and in their original packaging. To initiate a return, please contact our customer service team.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Yes, we ship to most countries worldwide. International shipping rates and delivery times vary depending on the destination. Please note that international orders may be subject to customs duties and taxes.",
  },
  {
    question: "How can I change or cancel my order?",
    answer:
      "If you need to change or cancel your order, please contact our customer service team as soon as possible. We can usually accommodate changes if the order hasn't been processed yet.",
  },
  {
    question: "Are there any discounts for bulk orders?",
    answer:
      "Yes, we offer special discounts for bulk orders. Please contact our sales team with details about your requirements to receive a custom quote.",
  },
  {
    question: "How do I care for my products?",
    answer:
      "Care instructions vary by product. You can find specific care information on the product page or on the label of the item. Generally, we recommend following the washing instructions on the garment tag.",
  },
]

function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  return (
    <div className="faq">
      <h2 className="faq__title">Frequently Asked Questions</h2>
      <div className="faq__container">
        {faqData.map((item, index) => (
          <div key={index} className={`faq__item ${activeIndex === index ? "active" : ""}`}>
            <div className="faq__question" onClick={() => toggleAccordion(index)}>
              <h3>{item.question}</h3>
              <span className="faq__icon">{activeIndex === index ? <FaChevronUp /> : <FaChevronDown />}</span>
            </div>
            <div className={`faq__answer ${activeIndex === index ? "active" : ""}`}>
              <p>{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FAQ
