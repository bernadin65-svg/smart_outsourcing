import React, { useState } from 'react'
import Title from './Title'
import assets from '../assets/assets'
import toast, { Toaster } from 'react-hot-toast'
import { motion } from 'motion/react'

function ContactUs() {
    const [loading, setLoading] = useState(false)

    const onSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        const formData = new FormData(event.target);
        const name    = formData.get("name");
        const email   = formData.get("email");
        const message = formData.get("message");

        try {
            const response = await fetch(
                "https://smart-outsourcing.onrender.com/api/users/contact",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        to:      "ybernadin65@gmail.com",
                        subject: `Nouveau message de ${name}`,
                        body:    `Nom : ${name}\nEmail : ${email}\n\nMessage :\n${message}`
                    })
                }
            );

            const data = await response.json();

            if (data.success) {
                toast.success("Message envoyé avec succès ! ✅");
                event.target.reset();
            } else {
                toast.error(data.message || "Erreur lors de l'envoi");
            }

        } catch (error) {
            toast.error("Serveur en cours de démarrage, réessayez dans 30 secondes...");
        } finally {
            setLoading(false);
        }
    }

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.2 }}
            id='Contactez-nous'
            className='flex flex-col items-center gap-7 px-4 sm:px-12 lg:px-24 xl:px-40 pt-30 text-gray-700 dark:text-white'>

            <Toaster />
            <Title Title='Contactez-nous' desc='' />

            <motion.form
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                onSubmit={onSubmit}
                className='grid sm:grid-cols-2 gap-3 sm:gap-5 max-w-2xl w-full'>

                {/* Nom */}
                <div>
                    <p className='mb-2 text-sm font-medium'>Votre nom</p>
                    <div className='flex pl-3 rounded-lg border border-gray-300 dark:border-gray-600'>
                        <img src={assets.person_icon} alt="" />
                        <input name="name" type="text"
                            placeholder='Entrez votre nom'
                            className='w-full p-3 text-sm outline-none' required />
                    </div>
                </div>

                {/* Email */}
                <div>
                    <p className='mb-2 text-sm font-medium'>Email</p>
                    <div className='flex pl-3 rounded-lg border border-gray-300 dark:border-gray-600'>
                        <img src={assets.email_icon} alt="" />
                        <input name="email" type="email"
                            placeholder='Entrez votre email'
                            className='w-full p-3 text-sm outline-none' required />
                    </div>
                </div>

                {/* Message */}
                <div className='sm:col-span-2'>
                    <p className='mb-2 text-sm font-medium'>Message</p>
                    <textarea name="message" rows={8}
                        placeholder='Entrez votre message'
                        className='w-full p-3 text-sm outline-none rounded-lg border border-gray-300 dark:border-gray-600'
                        required />
                </div>

                {/* Bouton */}
                <button type='submit' disabled={loading}
                    className='w-max flex gap-2 bg-primary text-white text-sm px-10 py-3 rounded-full cursor-pointer hover:scale-103 transition-all disabled:opacity-60'>
                    {loading ? "Envoi en cours..." : "Envoyer"}
                    {!loading && <img src={assets.arrow_icon} alt="" />}
                </button>

            </motion.form>
        </motion.div>
    )
}

export default ContactUs