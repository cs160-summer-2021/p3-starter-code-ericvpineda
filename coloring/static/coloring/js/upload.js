async function uploadFile() {
    let formData = new FormData();           
    formData.append("file", fileupload.files[0]);
    /*
    await fetch('./upload.php', {
    method: "POST", 
    body: formData
    });    
    */
    location.replace("http://localhost:8000/coloring/main")
}