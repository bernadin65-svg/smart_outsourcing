import React from 'react'
import assets from '../assets/assets'
import { motion } from 'motion/react'

function Footer({ theme }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}

      className='bg-slate-50 dark:bg-gray-900 pt-10 mt-20 sm:pt-20 sm:mt-40 px-4 sm:px-40 lg:px-24 xl:px-40'
    >

      {/* Footer top */}
      <div className='flex justify-between lg:items-center max-lg:flex-col gap-10'>

        {/* gauche */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}

          className='space-y-5 text-sm text-gray-700 dark:text-gray-400'
        >
          <img
            src={assets.smartflow_logo}
            className='w-32 sm:w-45'
            alt="Logo"
          />

          <p className='max-w-md'>
            Votre partenaire stratégique en outsourcing à Madagascar : l'alliance de la performance technologique et du talent humain pour propulser votre business.
          </p>

          <ul className='flex gap-3'>
            <a href="#" className='hover:border-b'>Accueil</a>
            <a href="#Services" className='hover:border-b'>Services</a>
            <a href="#Contactez-nous" className='hover:border-b'>Contactez-nous</a>
            <a href="#PourquoiMadagascar" className='hover:border-b'>Pourquoi Madagascar ?</a>
          </ul>
        </motion.div>

        {/* droite */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}

          className='text-gray-600 dark:text-gray-400'
        >
          <h3 className='font-semibold'>
            Abonnez-vous à notre newsletter
          </h3>

          <p className='text-sm mt-2 mb-6'>
            Les dernières nouvelles, articles et ressources sont envoyés chaque semaine.
          </p>

          <div className='flex gap-2'>
            <input
              type="email"
              placeholder='Entrez votre email'
              className='w-full p-3 text-sm outline-none rounded dark:text-gray-100 bg-transparent border border-gray-400'
            />

            <button className='bg-primary text-white rounded px-6'>
              Abonner
            </button>
          </div>
        </motion.div>

      </div>

      <hr className='border-gray-300 dark:border-gray-600 my-6' />

      {/* Footer bas */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        viewport={{ once: true }}

        className='pb-6 text-sm text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-4'
      >

        {/* gauche */}
        <p className='text-center sm:text-left'>
          © 2026 BPO Madagascar. Tous droits réservés
        </p>

        {/*  milieu */}
        <div className='flex gap-4 justify-center'>
          <a href="#" className='hover:text-blue-500 transition'>
            Mentions légales
          </a>
          <span>|</span>
          <a href="#" className='hover:text-blue-500 transition'>
            Politique de confidentialité
          </a>
        </div>

        {/* droite */}
        <div className='flex items-center gap-4'>
          <a href="https://web.facebook.com/" target='_blank' rel='noopener noreferrer'>
            <img src={assets.facebook_icon} alt="" />
          </a>

          <a href="https://www.instagram.com/" target='_blank' rel='noopener noreferrer'>
            <img src={assets.instagram_icon} alt="" />
          </a>

          <a href="https://www.linkedin.com/" target='_blank' rel='noopener noreferrer'>
            <img src={assets.linkedin_icon} alt="" />
          </a>
        </div>

      </motion.div>

    </motion.div>
  )
}

export default Footer