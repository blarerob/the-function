import { useState, useCallback } from "react";
import { Dispatch, SetStateAction } from "react";
import { styled } from '@mui/material/styles';
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useDropzone } from 'react-dropzone';
import Alert from '@mui/material/Alert';


const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

type FileUploaderProps = {
    onFieldChange: (url: string) => void;
    imageUrl: string;
    setFiles: Dispatch<SetStateAction<File[]>>;
};

const convertFileToUrl = (file: File): string => URL.createObjectURL(file);

export const FileUploader = ({ setFiles, onFieldChange}: FileUploaderProps) => {
    const [loading, setLoading] = useState(false);
    const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

    console.log(loading)

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            const url = convertFileToUrl(file);
            setSelectedImageUrl(url);
            onFieldChange(url);
            setFiles(acceptedFiles);
        }
    }, [onFieldChange, setFiles]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        multiple: undefined,
        onDragEnter: undefined,
        onDragOver: undefined,
        onDragLeave: undefined
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            const url = convertFileToUrl(file);
            setSelectedImageUrl(url);
            onFieldChange(url);
            setFiles(Array.from(files));
        }
    };

    return (
        <div>
            <div {...getRootProps()} style={{ padding: '20px', marginTop: '10px' }}>
                <input {...getInputProps()} />
                <Button
                    className='btn rounded-4xl h-25 w-60 hover:bg-primary'
                    component="label"
                    role={undefined}
                    variant="text"
                    tabIndex={-1}
                    sx={{ color: 'white', backgroundColor: 'grey' }}                >
                    <VisuallyHiddenInput
                        type="file"
                        onChange={handleFileChange}
                    />
                <div className='flex flex-col items-center justify-center'>
                    <CloudUploadIcon style={{ display: 'block', margin: '0 auto' }} />
                        <div className='flex flex-col items-center justify-center textarea-xs'>
                         Upload files
                            <br />
                            <div className='mt-2  text-nowrap' style={{ border: '2px dotted white', borderWidth: '1px', padding: '5%' }}>
                                Drag & drop
                            </div>
                        </div>
                 </div>
                </Button>
            </div>
            {selectedImageUrl && (
                <div>
                    <Alert severity="success" className='w-60 text-nowrap'>File uploaded successfully!</Alert>
                    <img
                        src={selectedImageUrl}
                        alt="Success"
                        style={{ maxWidth: '50%', height: '50%' }}
                        onLoad={() => setLoading(false)}
                        onError={(e) => {
                            console.error("Error loading image:", e);
                            setLoading(false);
                        }}
                    />
                </div>
            )}
        </div>
    );
};