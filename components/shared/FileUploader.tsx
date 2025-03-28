import { useState } from "react";
import { UploadDropzone } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { Dispatch, SetStateAction } from "react";

type FileUploaderProps = {
    onFieldChange: (url: string) => void;
    imageUrl: string;
    setFiles: Dispatch<SetStateAction<File[]>>;
};

const convertFileToUrl = (file: File): string => URL.createObjectURL(file);

export const FileUploader = ({ setFiles, onFieldChange, imageUrl }: FileUploaderProps) => {
    const [loading, setLoading] = useState(false);

    return (
        <div>
            <div className="h-50 w-10 flex flex-row gap-5">
            <UploadDropzone<OurFileRouter, "imageUploader">
                endpoint="imageUploader"
                onDrop={(files) => {
                    setFiles(files);
                    onFieldChange(convertFileToUrl(files[0]));
                    setLoading(true);
                }}
            />
            </div>
            {imageUrl && (
                <div>
                    <h3>Uploaded File:</h3>
                    <img
                        src={imageUrl}
                        alt="Uploaded file"
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