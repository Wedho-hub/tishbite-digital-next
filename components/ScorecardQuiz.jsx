"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";
import LeadForm from "@/components/LeadForm";

const QUESTIONS = [
  { id: "gbp", text: "Do you have a Google Business Profile set up?" },
  { id: "ranking", text: "Does your business show up on page 1 of Google for what you do + your area?" },
  { id: "website", text: "Do you have a website?" },
  { id: "mobile", text: "Is that website fast and easy to use on a phone?" },
  { id: "social", text: "Do you have active Facebook or Instagram pages?" },
  { id: "posting", text: "Do you post on social media at least once a week?" },
  { id: "whatsapp", text: "Can customers message or WhatsApp you directly from your page?" },
  { id: "reviews", text: "Do you have online reviews on Google or Facebook?" },
  { id: "ads", text: "Do you run any paid ads (Google or Meta)?" },
  { id: "tracking", text: "Do you know exactly where your leads and customers come from?" },
];

const OPTIONS = [
  { label: "Yes", points: 1 },
  { label: "Not sure", points: 0.5 },
  { label: "No", points: 0 },
];

function scoreBand(score) {
  if (score <= 3) return { label: "Invisible Online", blurb: "Most potential customers can't find you at all right now." };
  if (score <= 6) return { label: "Barely Visible", blurb: "You have a presence, but there are real gaps costing you enquiries." };
  if (score <= 8) return { label: "Visible, But Leaking Leads", blurb: "You're findable — a few fixes would turn that into more enquiries." };
  return { label: "Strong Online Presence", blurb: "You're ahead of most local businesses. Let's tighten the last few gaps." };
}

export default function ScorecardQuiz({ offer }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);

  const total = QUESTIONS.length;
  const isDone = step >= total;
  const score = answers.reduce((sum, points) => sum + points, 0);
  const band = isDone ? scoreBand(score) : null;

  const choose = (points) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[step] = points;
      return next;
    });
    setStep((s) => s + 1);
  };

  const goBack = () => setStep((s) => Math.max(0, s - 1));

  if (isDone) {
    return (
      <div className="flex flex-col gap-4">
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-primary/10 shadow-lg text-center">
          <p className="text-text-muted text-xs font-bold uppercase tracking-wider mb-1">Your Online Visibility Score</p>
          <p
            className="text-5xl font-extrabold text-primary-dark leading-none mb-2"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            {score}<span className="text-2xl text-text-muted">/10</span>
          </p>
          <p className="inline-flex items-center px-3 py-1 rounded-full bg-accent/20 border border-accent/40 text-[#173828] text-sm font-bold mb-2">
            {band.label}
          </p>
          <p className="text-text-muted text-sm leading-relaxed m-0">{band.blurb}</p>
        </div>
        <LeadForm offer={offer} extraData={{ score, band: band.label }} />
      </div>
    );
  }

  const question = QUESTIONS[step];

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-primary/10 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        {step > 0 ? (
          <button
            type="button"
            onClick={goBack}
            aria-label="Previous question"
            className="text-primary text-sm font-semibold flex items-center gap-1"
          >
            <FaArrowLeft size={11} aria-hidden="true" /> Back
          </button>
        ) : <span />}
        <p className="text-text-muted text-xs font-bold uppercase tracking-wider m-0">
          Question {step + 1} of {total}
        </p>
      </div>

      <div className="h-1.5 bg-primary/10 rounded-full overflow-hidden mb-4">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={false}
          animate={{ width: `${(step / total) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.25 }}
        >
          <h2 className="text-base sm:text-lg font-bold text-primary-dark mb-4 leading-snug" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
            {question.text}
          </h2>

          <div className="flex flex-col gap-2">
            {OPTIONS.map((opt) => (
              <motion.button
                key={opt.label}
                type="button"
                onClick={() => choose(opt.points)}
                className="w-full text-left px-4 py-3 rounded-xl border-2 border-primary/15 font-semibold text-sm text-text-dark hover:border-primary hover:bg-primary/5 transition-colors duration-150"
                whileTap={{ scale: 0.98 }}
              >
                {opt.label}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
