'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import type { ClinicInfo } from '@/lib/types'
import { Icon } from '@/lib/icons'

const ALL_LINKS: Record<string, { href: string; label: string }> = {
  home:         { href: '/',                    label: 'Home' },
  about:        { href: '/about',               label: 'About' },
  doctor:       { href: '/doctor',              label: 'Doctor' },
  team:         { href: '/team',                label: 'Team' },
  services:     { href: '/services',            label: 'Services' },
  products:     { href: '/products',            label: 'Products' },
  testimonials: { href: '/testimonials',        label: 'Testimonials' },
  locations:    { href: '/locations',           label: 'Locations' },
  blog:         { href: '/blog',                label: 'Blog' },
  contact:      { href: '/contact',             label: 'Contact' },
  reviews:      { href: '/reviews',             label: 'Reviews' },
  conditions:   { href: '/services#conditions', label: 'Conditions' },
  procedures:   { href: '/services#procedures', label: 'Procedures' },
  gallery:      { href: '/gallery',             label: 'Gallery' },
  stories:      { href: '/success-stories',     label: 'Success Stories' },
}

const MENU_BY_ENTITY: Record<string, string[]> = {
  'Physician':           ['home', 'doctor', 'services', 'products', 'locations', 'stories', 'blog', 'contact'],
  'Solo Clinic':         ['home', 'about', 'doctor', 'services', 'products', 'locations', 'stories', 'blog', 'contact'],
  'Multi-Doctor Clinic': ['home', 'about', 'doctor', 'team', 'services', 'products', 'locations', 'stories', 'blog', 'contact'],
  'Group Practice':      ['home', 'about', 'team', 'services', 'products', 'locations', 'stories', 'blog', 'contact'],
}

const DEFAULT_MENU = ['home', 'about', 'doctor', 'team', 'services', 'products', 'locations', 'gallery', 'stories', 'blog', 'reviews', 'contact']

export default function Header({ clinic }: { clinic: ClinicInfo }) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuKeys = (clinic.type && MENU_BY_ENTITY[clinic.type]) || DEFAULT_MENU
  const navLinks = menuKeys.map(k => ALL_LINKS[k]).filter(Boolean)

  return (
    <header className="header">
      <div className="header-inner">
        <Link href="/" className="logo" aria-label="Go to homepage">
          {clinic.logo ? (
            <Image src={clinic.logo} alt={clinic.name} width={200} height={56} style={{ height: 56, width: 'auto', maxWidth: 200, objectFit: 'contain', display: 'block' }} priority />
          ) : (
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'linear-gradient(135deg, var(--secondary), var(--primary))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name="home" size={24} color="#FFFFFF" />
            </div>
          )}
        </Link>
        <nav className="nav">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} className={pathname === link.href ? 'active' : ''}>{link.label}</Link>
          ))}
        </nav>
        <button className="hamburger" onClick={() => setMenuOpen(prev => !prev)} aria-label="Toggle menu">
          {menuOpen ? <Icon name="close" size={24} /> : <Icon name="menu" size={24} />}
        </button>
      </div>
      {menuOpen && (
        <nav className="mobile-nav">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} className={pathname === link.href ? 'active' : ''} onClick={() => setMenuOpen(false)}>{link.label}</Link>
          ))}
        </nav>
      )}
    </header>
  )
}
