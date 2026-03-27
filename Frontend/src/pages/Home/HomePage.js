
import { Link } from 'react-router-dom';
import { landingFeatures, mockTestimonials, mockSubscriptionPlans } from '../../data/staticData';
import { trainerService, classService } from '../../services/api';
import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../../utils/helpers';
import ClassCard from '../../components/ClassScheduling/ClassCard';
import TrainerCard from '../../components/Trainer/TrainerCard';
import Navbar from '../../components/Layout/Navbar';
import Footer from '../../components/Layout/Footer';

const HomePage = () => {
  const [trainers, setTrainers] = useState([]);
  const [classes, setClasses] = useState([]);
  useEffect(() => {
    trainerService.getAll().then(res => setTrainers(res.data.data.slice(0, 4))).catch(() => {});
    classService.getAll().then(res => setClasses(res.data.data)).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-dark-950">
      {/* <Navbar /> */}
      {/* ============ HERO SECTION ============ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-hero-gradient"></div>
        <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] border-4 border-primary-500/20 rounded-full transform -translate-y-1/2 animate-pulse-slow"></div>
        <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] border-4 border-primary-500/30 rounded-full transform -translate-y-1/2 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-20 left-10 w-2 h-2 bg-primary-400 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-accent-emerald rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 left-1/4 w-2 h-2 bg-primary-300 rounded-full animate-float" style={{ animationDelay: '3s' }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="animate-slide-in-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full text-primary-400 text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></span>
                #1 Fitness Management Platform
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white leading-tight">
                Complete Daily{' '}
                <span className="gradient-text">Workout</span>{' '}
                At Home
              </h1>

              <p className="text-dark-300 text-lg mt-6 max-w-lg leading-relaxed">
                Transform your fitness journey with FitnessDesk. Expert trainers, personalized workout plans, and seamless class scheduling — all in one platform.
              </p>

              <div className="flex flex-wrap gap-4 mt-8">
                <Link to="/signup" className="btn-primary text-base flex items-center gap-2">
                  Get Started Now
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link to="/login" className="btn-secondary text-base">
                  Log In
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-12">
                {[
                  { value: '245+', label: 'Active Members' },
                  { value: '12+', label: 'Expert Trainers' },
                  { value: '24+', label: 'Fitness Classes' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl md:text-3xl font-display font-bold gradient-text">{stat.value}</p>
                    <p className="text-dark-500 text-sm mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Illustration */}
            <div className="relative hidden lg:flex justify-center animate-slide-in-right">
              <div className="relative w-[420px] h-[420px]">
                {/* Teal Rings */}
                <div className="absolute inset-0 border-4 border-primary-500/30 rounded-full animate-pulse-slow"></div>
                <div className="absolute inset-4 border-4 border-primary-500/20 rounded-full animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
                <div className="absolute inset-8 border-2 border-primary-500/10 rounded-full"></div>

                {/* Center Content */}
                <div className="absolute inset-12 bg-gradient-to-br from-primary-500/20 to-dark-950 rounded-full flex items-center justify-center overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(20,184,166,0.2)]">
                  <img src="/images/hero.png" alt="Gym Hero" className="w-full h-full object-cover opacity-80 mix-blend-lighten" />
                </div>

                {/* Floating Cards */}
                <div className="absolute -top-4 -right-4 glass-card p-3 animate-float">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🔥</span>
                    <div>
                      <p className="text-white text-xs font-medium">Calories Burned</p>
                      <p className="text-primary-400 text-sm font-bold">3,240 kcal</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-4 glass-card p-3 animate-float" style={{ animationDelay: '2s' }}>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">💪</span>
                    <div>
                      <p className="text-white text-xs font-medium">Workouts Done</p>
                      <p className="text-primary-400 text-sm font-bold">87 Sessions</p>
                    </div>
                  </div>
                </div>

                <div className="absolute top-1/2 -right-12 glass-card p-3 animate-float" style={{ animationDelay: '3s' }}>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">⚡</span>
                    <div>
                      <p className="text-white text-xs font-medium">Day Streak</p>
                      <p className="text-primary-400 text-sm font-bold">12 Days</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* ============ FEATURES SECTION ============ */}
      <section id="features" className="py-20 bg-dark-950 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="text-primary-400 text-sm font-semibold uppercase tracking-wider">Why Choose Us</span>
            <h2 className="section-title mt-2">Everything You Need to <span className="gradient-text">Stay Fit</span></h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              From class scheduling to payment management, we've got every aspect of your fitness journey covered.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {landingFeatures.map((feature, i) => (
              <div
                key={i}
                className="glass-card-hover p-8 group"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-primary-500/20 to-accent-emerald/20 rounded-2xl flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-dark-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CLASSES SECTION ============ */}
      <section id="classes" className="py-20 bg-dark-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary-400 text-sm font-semibold uppercase tracking-wider">Our Classes</span>
            <h2 className="section-title mt-2">Popular <span className="gradient-text">Fitness Classes</span></h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              Join our expert-led group classes designed for all fitness levels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {classes.slice(0, 4).map((cls) => (
              <ClassCard key={cls.id} classData={cls} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/signup" className="btn-secondary inline-flex items-center gap-2">
              View All Classes
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ============ TRAINERS SECTION ============ */}
      <section className="py-20 bg-dark-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary-400 text-sm font-semibold uppercase tracking-wider">Our Team</span>
            <h2 className="section-title mt-2">Meet Our <span className="gradient-text">Expert Trainers</span></h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              Certified professionals dedicated to helping you achieve your fitness goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trainers.map((trainer) => (
              <TrainerCard key={trainer.id} trainer={trainer} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ PRICING SECTION ============ */}
      <section id="pricing" className="py-20 bg-dark-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary-400 text-sm font-semibold uppercase tracking-wider">Pricing Plans</span>
            <h2 className="section-title mt-2">Choose Your <span className="gradient-text">Perfect Plan</span></h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              Flexible membership plans designed to fit your lifestyle and budget.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {mockSubscriptionPlans.map((plan) => (
              <div
                key={plan.id}
                className={`glass-card-hover relative overflow-hidden ${plan.popular ? 'ring-2 ring-primary-500 shadow-glow scale-105' : ''
                  }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-primary-500 to-accent-emerald text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl">
                    MOST POPULAR
                  </div>
                )}
                <div className={`h-1.5 bg-gradient-to-r ${plan.color}`}></div>
                <div className="p-8 text-center">
                  <h3 className="text-xl font-display font-bold text-white">{plan.name}</h3>
                  <div className="mt-4 mb-6">
                    <span className="text-5xl font-display font-bold gradient-text">
                      {formatCurrency(plan.price)}
                    </span>
                    <span className="text-dark-400">/{plan.period}</span>
                  </div>
                  <div className="space-y-3 mb-8 text-left">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-dark-300">
                        <svg className="w-4 h-4 text-primary-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </div>
                    ))}
                  </div>
                  <Link
                    to="/signup"
                    className={`block w-full py-3 rounded-xl font-medium transition-all duration-300 text-center ${plan.popular
                        ? 'bg-gradient-to-r from-primary-500 to-accent-emerald text-white hover:shadow-glow'
                        : 'bg-white/5 text-white hover:bg-primary-500/10 hover:text-primary-400'
                      }`}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS SECTION ============ */}
      <section className="py-20 bg-dark-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary-400 text-sm font-semibold uppercase tracking-wider">Testimonials</span>
            <h2 className="section-title mt-2">What Our <span className="gradient-text">Members Say</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="glass-card-hover p-8">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }, (_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < testimonial.rating ? 'text-amber-400' : 'text-dark-700'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-dark-300 text-sm leading-relaxed italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-3 mt-6">
                  <div className="w-10 h-10 overflow-hidden bg-primary-500/20 rounded-full flex items-center justify-center text-xl shrink-0">
                    <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{testimonial.name}</p>
                    <p className="text-dark-500 text-xs">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA SECTION ============ */}
      <section className="py-20 bg-dark-900/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="glass-card p-12 md:p-16 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary-500/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-accent-emerald/20 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
                Ready to Start Your <span className="gradient-text">Fitness Journey</span>?
              </h2>
              <p className="text-dark-300 text-lg mt-4 max-w-2xl mx-auto">
                Join FitnessDesk today and get access to expert trainers, personalized workout plans, and a supportive fitness community.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <Link to="/signup" className="btn-primary text-base">
                  Start Free Trial
                </Link>
                <Link to="/login" className="btn-secondary text-base">
                  Already a Member?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;

