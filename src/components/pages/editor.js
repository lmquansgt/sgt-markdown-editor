import MDEditor from '@uiw/react-md-editor';
import 'assets/css/App.css';
import { useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import rehypeSanitize from 'rehype-sanitize';

const openings = ['[', '{', '(', '<', "'", '"', '`'];
const closings = [']', '}', ')', '>', "'", '"', '`'];

export default function Editor() {
    const [cookies, setCookies] = useCookies();
    const content = cookies.sgtMarkdownData
        ? decodeURIComponent(cookies.sgtMarkdownData)
        : '';
    const [value, setValue] = useState(content);
    const [autoFilled, setAutoFilled] = useState(false);
    const [cursor, setCursor] = useState(0);
    const editorRef = useRef(null);

    const linesToCheck = ['name:', 'slug:'];
    const shouldRemindSlug = !linesToCheck.every((line) =>
        value.includes(line),
    );

    useEffect(() => {
        const saveCookieAfterCountdown = () => {
            const countdownTimeout = setTimeout(() => {
                setCookies('sgtMarkdownData', encodeURIComponent(value), {
                    path: '/',
                });
            }, 3000);
            return () => clearTimeout(countdownTimeout);
        };

        saveCookieAfterCountdown();
    }, [value, setCookies]);

    const handlePairing = (e) => {
        console.log(e);
        const { keyCode, key, type } = e;
        const isInput =
            keyCode !== 8 &&
            keyCode !== 46 &&
            key !== 'Backspace' &&
            key !== 'Delete' &&
            type !== 'paste';
        const lastChar = key;
        const charIndex = openings.indexOf(lastChar);
        const input = editorRef.current;
        if (input && isInput && charIndex > -1) {
            const textarea = input.textarea;
            const startPos = textarea.selectionStart;
            const endPos = textarea.selectionEnd;
            if (endPos === startPos) {
                const newValue =
                    value.substring(0, startPos) +
                    closings[charIndex] +
                    value.substring(startPos);
                const cursorPos = textarea.selectionStart;
                setValue(newValue);
                setAutoFilled(true);
                setCursor(cursorPos);
            }
        } else {
            setValue(e.target.value);
        }
    };

    useEffect(() => {
        if (autoFilled && editorRef.current) {
            editorRef.current.textarea.setSelectionRange(cursor, cursor);
            setAutoFilled(false);
        }
    }, [autoFilled, cursor]);

    return (
        <>
            <div className="container" data-color-mode="light">
                <MDEditor
                    ref={editorRef}
                    onKeyUp={handlePairing}
                    value={value}
                    fullscreen={true}
                    onChange={setValue}
                    previewOptions={{ rehypePlugins: [[rehypeSanitize]] }}
                />
            </div>
            {shouldRemindSlug && (
                <div className="notif">
                    <p>You're missing some headings!</p>
                    <p>Remember to includes necessary metadata!</p>
                    <p>Example:</p>
                    <p>name: Quynh Nguyen</p>
                    <p>slug: quynh-nguyen</p>
                </div>
            )}
        </>
    );
}
