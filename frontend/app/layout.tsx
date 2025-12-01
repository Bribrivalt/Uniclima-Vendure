import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { ApolloWrapper } from '@/lib/apollo-provider'

export const metadata: Metadata = {
    title: 'Uniclima - Climatización Profesional',
    description: 'Especialistas en aire acondicionado, calderas y climatización',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="es">
            <body>
                <ApolloWrapper>
                    <Header />
                    <main>{children}</main>
                    <Footer />
                </ApolloWrapper>
            </body>
        </html>
    )
}
