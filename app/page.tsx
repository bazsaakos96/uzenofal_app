'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Message = {
    id: string
    content: string
    author: string
    created_at: string
}

export default function Home() {
    const [messages, setMessages] = useState<Message[]>([])
    const [content, setContent] = useState('')
    const [author, setAuthor] = useState('')
    const [loading, setLoading] = useState(false)

    const fetchMessages = async () => {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: true }) // 🔥 legrégebbi elöl

        if (!error && data) {
            setMessages(data)
        }
    }

    useEffect(() => {
        fetchMessages()
    }, [])

    const saveMessage = async () => {
        if (!content.trim() || !author.trim()) return

        setLoading(true)

        const { error } = await supabase.from('messages').insert([
            {
                content,
                author,
            },
        ])

        setLoading(false)
        setContent('')
        setAuthor('')

        if (!error) {
            fetchMessages()
        }
    }

    const deleteMessage = async (id: string) => {
        const { error } = await supabase
            .from('messages')
            .delete()
            .eq('id', id)

        if (!error) {
            fetchMessages()
        }
    }

    return (
        <main style={styles.container}>
            <h1 style={styles.title}>Üzenőfal</h1>

            <div style={styles.form}>
                <input
                    style={styles.input}
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Neved..."
                />

                <input
                    style={styles.input}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Írj egy üzenetet..."
                />

                <button onClick={saveMessage} style={styles.button}>
                    {loading ? 'Mentés...' : 'Mentés'}
                </button>
            </div>

            <div style={styles.messages}>
                {messages.map((msg) => (
                    <div key={msg.id} style={styles.card}>
                        <p style={styles.content}>{msg.content}</p>

                        <div style={styles.meta}>
                            <span><strong>{msg.author}</strong></span>
                            <span>
                {new Date(msg.created_at).toLocaleString()}
              </span>
                        </div>

                        <button
                            onClick={() => deleteMessage(msg.id)}
                            style={styles.deleteButton}
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
        </main>
    )
}

const styles: any = {
    container: {
        minHeight: '100vh',
        padding: '40px',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        color: 'white',
        fontFamily: 'sans-serif',
    },
    title: {
        textAlign: 'center',
        marginBottom: '20px',
    },
    form: {
        display: 'flex',
        gap: '10px',
        justifyContent: 'center',
        marginBottom: '30px',
        flexWrap: 'wrap',
    },
    input: {
        padding: '10px',
        borderRadius: '8px',
        border: 'none',
        width: '200px',
    },
    button: {
        padding: '10px 15px',
        borderRadius: '8px',
        border: 'none',
        background: '#ff7e5f',
        color: 'white',
        cursor: 'pointer',
    },
    messages: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        maxWidth: '500px',
        margin: '0 auto',
    },
    card: {
        background: 'rgba(255,255,255,0.1)',
        padding: '15px',
        borderRadius: '10px',
        position: 'relative',
    },
    content: {
        fontSize: '16px',
        marginBottom: '10px',
    },
    meta: {
        fontSize: '12px',
        opacity: 0.7,
        display: 'flex',
        justifyContent: 'space-between',
    },
    deleteButton: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'red',
        border: 'none',
        color: 'white',
        borderRadius: '50%',
        width: '25px',
        height: '25px',
        cursor: 'pointer',
    },
}