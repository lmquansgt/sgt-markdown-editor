import MDEditor from '@uiw/react-md-editor';
import 'assets/css/App.css';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import rehypeSanitize from 'rehype-sanitize';
import { cookieSettings, getCookie } from 'utils/cookie';

export default function Editor() {
    const [cookies, setCookies] = useCookies();
    const content = cookies.sgtMarkdownData ? decodeURIComponent(cookies.sgtMarkdownData) : ''
    const [value, setValue] = useState(content);

    useEffect(() => {
        const saveFile = (content) => {
            setCookies('sgtMarkdownData', content, cookieSettings);
        };

        const interval = setInterval(() => {
            saveFile(value);
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [value]);

    return (
        <div className="container" data-color-mode="light">
            <MDEditor
                value={value}
                fullscreen={true}
                onChange={setValue}
                previewOptions={{ rehypePlugins: [[rehypeSanitize]] }}
            />
        </div>
    );
}
