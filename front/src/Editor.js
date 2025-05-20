// Editor.js
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';

export default function Editor({ value, onChange }) {  // Changed from (value, onChange) to {value, onChange}
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '+1' }, { 'indent': '-1' }],
            ['link', 'image'],
            ['clean']
        ]
    };

    return (
        <div className="content-editor">  {/* Added a wrapper div */}
            <ReactQuill
                value={value}
                onChange={onChange}
                theme={"snow"}
                modules={modules}
            />
        </div>
    );
}