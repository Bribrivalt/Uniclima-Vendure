import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
    title: 'Uniclima - Climatización Profesional',
    description: 'Especialistas en aire acondicionado, calderas y climatización',
}

export default function RootLayout({
    children,
}: {
    children: React.Node
}) {
    return (
        <html lang="es">
            <body>
                <Header />
                <main>{children}</main>
                <Footer />
            </body>
        </html>
    )
}
