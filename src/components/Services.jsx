import React, { useState } from 'react'
import assets from '../assets/assets'
import Title from './Title'
import ServiceCard from './ServiceCard'
import { motion } from "motion/react"

const Services = () => {

    const [pos, setPos] = useState({ x: 0, y: 0 })

    const ServicesData = [
        {
            title: 'Relation client ',
            description: " Centres d'appels(appels entrants / sortants), support technique, service après-vente .",
            icon: assets.ads_icon,
        },
        {
            title: 'Back Office',
            description: 'Saisie de données, gestion de documents, traitement administratif.',
            icon: assets.marketing_icon,
        },
        {
            title: 'Ventes et Marketing',
            description: 'Téléprospection, prise de rendez-vous, qualification de prospects. ',
            icon: assets.content_icon,
        },
        {
            title: 'Fonctions supports',
            description: 'Ressources humaines, comptabilité, gestion de la paie.',
            icon: assets.social_icon,
        },
    ]

    return (
        <motion.div
            id='Services'

            onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                setPos({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                })
            }}

            className='relative overflow-hidden flex flex-col items-center gap-7 px-4 sm:px-12 lg:px-24 xl:px-40 pt-30 text-gray-700 dark:text-white'

            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.2 }}
        >

            {/* 🔵 GRAND ROND BLEU */}
            <motion.div
                className='absolute w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-3xl pointer-events-none -z-10'
                animate={{
                    left: pos.x,
                    top: pos.y
                }}
                transition={{ type: "spring", stiffness: 50 }}
                style={{
                    transform: "translate(-50%, -50%)"
                }}
            />

            {/* background image */}
            <img
                src={assets.bgImage2}
                alt=""
                className='absolute -top-110 -left-70 -z-10 dark:hidden'
            />

            <Title
                title='Comment pouvons nous vous aider ?'
                desc='Nous vous aidons à réduire vos coûts, accélérer votre croissance et maximiser votre rentabilité.'
            />

            <motion.div className='flex flex-col md:grid grid-cols-2 gap-6'>
                {ServicesData.map((service, index) => (
                    <ServiceCard key={index} service={service} index={index} />
                ))}
            </motion.div>

        </motion.div>
    )
}

export default Services