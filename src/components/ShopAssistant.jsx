import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaCommentDots, FaPaperPlane, FaTimes, FaWhatsapp } from 'react-icons/fa'
import { apiFetch } from '../config/api.js'
import { WHATSAPP_NUMBER } from '../config/site'
import { RASHIS } from '../content/rashi'
import { QUICK_REPLIES, answer, productTitle } from '../utils/shopAssistant'
import { pricingFromProduct } from '../utils/productPricing'
import { trackLead } from '../utils/analytics.js'

const GREETING = {
  from: 'bot',
  text: 'Namaste! Tell me what you are looking for, for example "Rudraksha for Tula rashi", "something for peace" or "Karungali mala under ₹1,000", and I will show you matching products.',
}

const inr = (n) => `₹${Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`

function ProductSuggestion({ product, onOpen }) {
  const { currentPrice } = pricingFromProduct(product)
  return (
    <Link
      to={`/product/${product.slug}`}
      onClick={onOpen}
      className="flex items-center gap-3 rounded-xl border border-orange-100 bg-white p-2 shadow-sm transition-colors hover:border-primary/50"
    >
      {product.images?.[0] ? (
        <img src={product.images[0]} alt={productTitle(product)} loading="lazy" className="h-14 w-14 shrink-0 rounded-lg object-cover" />
      ) : null}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-stone-900">{productTitle(product)}</span>
        <span className="text-sm font-bold text-primary">{inr(currentPrice)}</span>
        {Number(product.stock) <= 0 ? <span className="ml-2 text-xs text-red-600">Out of stock</span> : null}
      </span>
      <span className="shrink-0 rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-primary">View</span>
    </Link>
  )
}

function Message({ message, onOpenProduct, onChoose }) {
  if (message.from === 'user') {
    return (
      <div className="flex justify-end">
        <p className="max-w-[80%] rounded-2xl rounded-br-md bg-primary px-3.5 py-2 text-sm text-white">{message.text}</p>
      </div>
    )
  }
  return (
    <div className="space-y-2">
      <p className="max-w-[90%] rounded-2xl rounded-bl-md bg-white px-3.5 py-2.5 text-sm leading-relaxed text-stone-700 shadow-sm">{message.text}</p>
      {message.products?.length ? (
        <div className="space-y-2">
          {message.products.map((p) => (
            <ProductSuggestion key={p.slug} product={p} onOpen={onOpenProduct} />
          ))}
        </div>
      ) : null}
      {message.links?.length ? (
        <div className="flex flex-wrap gap-2">
          {message.links.map((link) => (
            <Link key={link.to} to={link.to} onClick={onOpenProduct} className="rounded-full border border-orange-200 bg-white px-3 py-1 text-xs font-semibold text-primary hover:bg-orange-50">
              {link.label}
            </Link>
          ))}
        </div>
      ) : null}
      {message.choices?.length ? (
        <div className="flex flex-wrap gap-2">
          {message.choices.map((choice) => (
            <button
              key={choice.value}
              type="button"
              onClick={() => onChoose(choice.value)}
              className="rounded-full border border-orange-200 bg-white px-3 py-1 text-xs font-semibold text-stone-700 hover:border-primary hover:text-primary"
            >
              {choice.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

/**
 * "Need help?" chat window. Answers from the live catalogue (src/utils/shopAssistant.js) with clickable
 * product suggestions, and hands the conversation to WhatsApp when the visitor wants a person.
 */
const ShopAssistant = () => {
  const [open, setOpen] = useState(false)
  const [products, setProducts] = useState([])
  const [messages, setMessages] = useState([GREETING])
  const [input, setInput] = useState('')
  // A question sent before the catalogue loaded waits here and is answered as soon as it arrives.
  const pendingRef = useRef(null)
  const endRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (!open || products.length) return
    apiFetch('/api/products?limit=200')
      .then((r) => r.json())
      .then((json) => {
        const list = json?.data || []
        setProducts(list)
        if (pendingRef.current) {
          const question = pendingRef.current
          pendingRef.current = null
          setMessages((m) => [...m.slice(0, -1), { from: 'bot', ...answer(question, list) }])
        }
      })
      .catch(() => {})
  }, [open, products.length])

  useEffect(() => {
    if (!open) return undefined
    endRef.current?.scrollIntoView({ block: 'end' })
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, messages])

  useEffect(() => {
    if (open) inputRef.current?.focus({ preventScroll: true })
  }, [open])

  const send = (text) => {
    const value = String(text || '').trim()
    if (!value) return
    setInput('')
    if (/^rudraksha for my rashi$/i.test(value)) {
      setMessages((m) => [
        ...m,
        { from: 'user', text: value },
        { from: 'bot', text: 'Which is your rashi (Moon sign)?', choices: RASHIS.map((r) => ({ label: `${r.name} (${r.hindi})`, value: `Rudraksha for ${r.name} rashi` })) },
      ])
      return
    }
    if (!products.length) {
      pendingRef.current = value
      setMessages((m) => [...m, { from: 'user', text: value }, { from: 'bot', text: 'Looking that up…' }])
      return
    }
    setMessages((m) => [...m, { from: 'user', text: value }, { from: 'bot', ...answer(value, products) }])
  }

  const asked = messages.filter((m) => m.from === 'user').map((m) => m.text)
  const whatsappText = asked.length
    ? `Namaste! I was using the chat on your website. I am looking for: ${asked.slice(-3).join('; ')}`
    : 'Namaste! I need help choosing the right Rudraksha.'
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappText)}`
  const closeOnMobile = () => {
    if (window.matchMedia('(max-width: 639px)').matches) setOpen(false)
  }

  return (
    <>
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open the shopping assistant"
          className="fixed bottom-[calc(var(--gg-tabbar-offset)+0.75rem)] right-4 z-120 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-white shadow-lg transition-all duration-300 hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 md:bottom-5"
        >
          <FaCommentDots className="text-xl" aria-hidden />
          <span className="text-sm font-semibold">Need help?</span>
        </button>
      ) : null}

      {open ? (
        <section
          role="dialog"
          aria-label="Gawri Ganga shopping assistant"
          className="fixed inset-0 z-130 flex flex-col bg-[#FFFAEB] shadow-2xl sm:inset-auto sm:bottom-5 sm:right-4 sm:h-[600px] sm:max-h-[calc(100vh-2.5rem)] sm:w-[380px] sm:rounded-2xl sm:border sm:border-orange-200"
        >
          <header className="flex items-center gap-3 bg-primary px-4 py-3 text-white sm:rounded-t-2xl">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20" aria-hidden>
              <FaCommentDots />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-heading text-base font-bold leading-tight">Gawri Ganga assistant</p>
              <p className="text-xs text-white/85">Instant product suggestions · Team on WhatsApp Mon–Sat</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="rounded-full p-2 hover:bg-white/15">
              <FaTimes aria-hidden />
            </button>
          </header>

          <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4" aria-live="polite">
            {messages.map((message, i) => (
              <Message key={i} message={message} onOpenProduct={closeOnMobile} onChoose={send} />
            ))}
            <div ref={endRef} />
          </div>

          <div className="border-t border-orange-100 bg-white px-3 pb-3 pt-2 sm:rounded-b-2xl">
            <div className="-mx-1 mb-2 flex gap-2 overflow-x-auto px-1 pb-1">
              {QUICK_REPLIES.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => send(q)}
                  className="shrink-0 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold text-stone-700 hover:border-primary hover:text-primary"
                >
                  {q}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                send(input)
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="What would you like to buy?"
                aria-label="Type your question"
                maxLength={200}
                className="min-w-0 flex-1 rounded-full border border-stone-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
              />
              <button type="submit" aria-label="Send" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white disabled:opacity-50" disabled={!input.trim()}>
                <FaPaperPlane className="text-sm" aria-hidden />
              </button>
            </form>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackLead({ source: 'assistant_whatsapp', questions: asked.length })}
              className="mt-2 flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-sm font-semibold text-white hover:brightness-95"
            >
              <FaWhatsapp aria-hidden /> Continue on WhatsApp
            </a>
          </div>
        </section>
      ) : null}
    </>
  )
}

export default ShopAssistant
