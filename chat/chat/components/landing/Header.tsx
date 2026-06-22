'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="w-full p-4 bg-transparent">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold text-white">FlowMind</div>
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="#features" className="text-gray-300 hover:text-white transition-colors">Features</Link>
          <Link href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</Link>
          <Link href="#contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link>
        </nav>
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" className="text-white">Log In</Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">Get Started</Button>
        </div>
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden mt-4">
          <nav className="flex flex-col space-y-4">
            <Link href="#features" className="text-gray-300 hover:text-white transition-colors">Features</Link>
            <Link href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</Link>
            <Link href="#contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link>
            <Button variant="ghost" className="text-white">Log In</Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Get Started</Button>
          </nav>
        </div>
      )}
    </header>
  )
}