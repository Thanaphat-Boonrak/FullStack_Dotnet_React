import { CloudUpload } from "@mui/icons-material";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import type { ReactCropperElement } from "react-cropper";
import { Cropper } from "react-cropper";
import "cropperjs/dist/cropper.css";

interface PreviewFile extends File {
  preview: string;
}

type Props = {
  uploadPhoto: (file: Blob) => void;
  loading: boolean;
};

export default function PhotoUploadWidget({ uploadPhoto, loading }: Props) {
  const [files, setFiles] = useState<PreviewFile[]>([]);

  const cropRef = useRef<ReactCropperElement>(null);

  const onCrop = useCallback(() => {
    const cropper = cropRef.current?.cropper;
    cropper?.getCroppedCanvas().toBlob((blob) => {
      uploadPhoto(blob as Blob);
    });
  }, [uploadPhoto]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        }),
      ),
    );
  }, []);

  useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  return (
    //
    <Grid container spacing={3}>
      <Grid size={4}>
        <Box
          {...getRootProps()}
          sx={{
            border: "dashed 3px #eee",
            borderColor: isDragActive ? "green" : "#eee",
            paddingTop: "30px",
            textAlign: "center",
            height: "280px",
          }}
        >
          <input {...getInputProps()} />
          <CloudUpload
            sx={{ fontSize: "80px", marginTop: "50px" }}
          ></CloudUpload>
          <Typography variant="h5">Drop Image Here</Typography>
        </Box>
      </Grid>

      {/*  */}
      <Grid size={4}>
        {files[0]?.preview && (
          <Cropper
            src={files[0].preview}
            style={{ height: 300, width: "90%" }}
            aspectRatio={1}
            initialAspectRatio={1}
            preview=".img-preview"
            guides={false}
            viewMode={1}
            background={false}
            ref={cropRef}
          />
        )}
      </Grid>

      {/*  */}
      <Grid size={4}>
        {files[0]?.preview && (
          <>
            <div
              className="img-preview"
              style={{ width: 300, height: 300, overflow: "hidden" }}
            ></div>

            <Button
              sx={{ my: 1, width: 300, pt: 0 }}
              onClick={onCrop}
              variant="contained"
              color="secondary"
              disabled={loading}
            >
              Upload Photo
            </Button>
          </>
        )}
      </Grid>
    </Grid>
  );
}
