package com.example.demo.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;

import org.springframework.core.io.UrlResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;

import java.nio.file.Paths;

import org.springframework.core.io.Resource;

import org.springframework.core.io.UrlResource;
import java.nio.file.Files;

import org.springframework.http.MediaType;

@RestController

@RequestMapping("/files")

@CrossOrigin(origins = "https://stms-xi.vercel.app/")

public class FileController {

        private final String UPLOAD_DIR = "uploads/";

        @PostMapping(

                        value = "/upload",

                        consumes = "multipart/form-data"

        )

        public ResponseEntity<String>

                        uploadFile(

                                        @RequestParam(

                                        "file"

                                        )

                                        MultipartFile file

        )

                                        throws IOException {

                String uploadDir =

                                System.getProperty(

                                                "user.dir"

                                )

                                                +

                                                "/uploads/";

                File folder =

                                new File(

                                                uploadDir

                                );

                if (

                !folder.exists()

                ) {

                        folder.mkdirs();

                }

                String fileName =

                                file.getOriginalFilename();

                File destination =

                                new File(

                                                uploadDir

                                                                +

                                                                fileName

                                );

                file.transferTo(

                                destination

                );

                return

                ResponseEntity.ok(

                                fileName

                );

        }

        @GetMapping("/{name}")

public ResponseEntity<Resource>

getFile(

@PathVariable

String name

)

throws Exception
{

Path path =

Paths.get(

System.getProperty("user.dir")

+

"/uploads/"

+

name

);

Resource resource =

new UrlResource(

path.toUri()

);

String contentType =

Files.probeContentType(
path
);

if(
contentType == null
)
{
contentType =
"application/octet-stream";
}

return

ResponseEntity.ok()

.contentType(

MediaType.parseMediaType(

contentType

)

)

.body(

resource

);

}
}