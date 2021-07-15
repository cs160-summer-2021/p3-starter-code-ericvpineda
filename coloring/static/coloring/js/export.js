var dict = {
    "jpg":'https://upload.wikimedia.org/wikipedia/commons/3/3a/Cat03.jpg',
    "png":'https://lh3.googleusercontent.com/proxy/g49vkUkOfSA9EaW5Rl1b_olh08XcPJwGJrKtEct5KndvSnLN4X2RNCt0XyFmMzccD3Oy1TV0dan6bKu0GEmcGEBmXTihnpK6aRRLbqsvNFhYMtprDiUzOR8VJtGJ0v4JQRWdXyijgth_',
    "psd":'https://images.squarespace-cdn.com/content/v1/5a2c764af43b551b489c752d/1519112194919-IF8HBNVNKAB2A8PTV9O9/javacatscafe18Feb20180118.jpg?format=2500w',
    "gif":'https://media2.giphy.com/media/3o6Zt481isNVuQI1l6/200.gif',
    "pdf":'https://upload.wikimedia.org/wikipedia/commons/d/dc/Young_cats.jpg'
}
function download() {
    axios({
        url: dict[$("#format-values").val()],
        method: 'GET',
        responseType: 'blob'
    })
        .then((response) => {
                var fileName = $("#file-name").val();
                if(fileName == ""){
                    fileName = 'image';
                }
                const url = window.URL
                    .createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download',fileName+'.'+$("#format-values").val());
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
        })
}