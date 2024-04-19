import MDEditor, { commands } from '@uiw/react-md-editor';
import 'assets/css/App.css';
import { Instruction, Warning } from 'components/organisms/warning';
import { template } from 'config/default';
import { useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import rehypeSanitize from 'rehype-sanitize';

const openings = ['[', '{', '(', '<', "'", '"', '`'];
const closings = [']', '}', ')', '>', "'", '"', '`'];

export default function Editor() {
    const [cookies, setCookies] = useCookies();
    let content = '';
    if (cookies.sgtMarkdownData) {
        content = decodeURIComponent(cookies.sgtMarkdownData);
    }
    if (content === '') {
        content = template;
    }
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
                    value={value}
                    onKeyUp={handlePairing}
                    onChange={setValue}
                    height="100%"
                    minHeight={'100%'}
                    highlightEnable={false}
                    fullscreen={true}
                    previewOptions={{ rehypePlugins: [[rehypeSanitize]] }}
                    extraCommands={[
                        shouldRemindSlug &&
                            commands.group([], {
                                name: 'warning',
                                groupName: 'Warning',
                                icon: <Warning />,
                                children: Instruction,
                                buttonProps: { 'aria-label': 'Show details' },
                            }),
                    ]}
                />
            </div>
        </>
    );
}
