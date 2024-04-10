import MDEditor from '@uiw/react-md-editor';
import 'css/App.css';
import React from 'react';
import rehypeSanitize from 'rehype-sanitize';

export default function App() {
    const [value, setValue] = React.useState('**Hello world!!!**');

    return (
        <div className="container" data-color-mode="light">
            <MDEditor
                value={value}
                fullscreen={true}
                onChange={setValue}
                previewOptions={{
                    rehypePlugins: [[rehypeSanitize]],
                }}
            />
        </div>
    );
}
