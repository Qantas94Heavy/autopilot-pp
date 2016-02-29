'use strict';

define(function () {
  var opus = 'T2dnUwACAAAAAAAAAACoA9ZoAAAAAH4mOaIBE09wdXNIZWFkAQE4AYC7AAAAAABPZ2dTAAAAAAAAAAAAAKgD'
           + '1mgBAAAAjFH4EAGnT3B1c1RhZ3MNAAAAbGlib3B1cyAxLjEuMgIAAAAlAAAARU5DT0RFUj1vcHVzZW5jIGZy'
           + 'b20gb3B1cy10b29scyAwLjEuOV0AAABFTkNPREVSX09QVElPTlM9LS1wYWRkaW5nIDAgLS1kaXNjYXJkLWNv'
           + 'bW1lbnRzIC0tZGlzY2FyZC1waWN0dXJlcyAtLWZyYW1lc2l6ZSA2MCAtLWJpdHJhdGUgMTJPZ2dTAAAAtAAA'
           + 'AAAAAKgD1mgCAAAAcw3m8xCBjIpfKyE7jpOJRyYeZ42XWOFTYSJFiONwQuAGvtlGMObJE1QEkkrRh0xzKgc7'
           + 'EPYcs4Qq4b3VRHxLlto7j3R2EgCk8DsadVMTe0TczhPqZfZs90/N7hY1UIWKCW4H/+cBZDJw5ltKwbYFyRub'
           + 'yUmasdfXYzeHg9hWz7WMx9q+Rb37WgsngVDC4s+lgxOub7tmWO5EOy/Js2Ztd2/tJeIE2p321Mr/N9RhCZz8'
           + 'JG7fCtBlG7eDVKEwZLSujlgpJopbPPWnJ5fUO7ST+AfaYDaU2eb3jHDkraVzBtue8Z6grATKQ4pwSLJ0Ylec'
           + 'dE3MdYfZtOBUk0rtlsgGU+JvEfHLgZtG4/M9Jn7V2LVx4B+04lz1Fxo71hflcFRdUIBY7BaZx+EAoAwtfwLq'
           + '5mL567gW3/uIDnuKkxK9MJaWwNMY2fwySzZ5OdR63QwIAqNc3/O/WHa3zGz2COc3ZQnpDwfv0tP5+7Pvk8dw'
           + 'oTAtyiuO/j+6t3/9e9R5MRrt6EnlJJjgo5U00T5s+/1oXL3GRb/C+OE0NSGNuG8Srtj/fJlVTbSv6zf5BsBY'
           + 'zn0j7vScS3CGAxMjFdORCX/5wFvxF9foNeCj3OI0KhXVNjhxgLAC/6NvoOr2ufjyrG/sSbJvuipv6CMrVVqO'
           + 'jhie7snCWBbp+0kcxcIeLCyaAHaOV7lwaV4Qu9TAWFgMkyBHU0XzPJVliWKBl/E53EFzJYlWTqUSTnJ91Xfz'
           + 'piaD0QZkhJFeRcBYAmEjD/JwztyDdmihSrBeCEmk0QsBaYgySONVQw+AtuRYIfVGXiG8KzbUHKfWsAaZt4IY'
           + '3oAbfA8JmzZiO/AcRnRS9Hhrq1y1ry6a5q6DAoxd6+e/+5k0Xlgiz1jsWT8CYDVQO0Ri61yo9SIlt3K916hH'
           + 'utMdkxIQ/ujQLR//2DHlI8HZ7I9iabjeadbZKg2NwIrpeb58nscj+1i6y3Sk9MtghVkRmKJyAFpj0vKQoYFZ'
           + 'g9o01SR7CADX7tc3c2BMGH4VTaCc/MwgF3GibTjwaAm//wkPPgIq8dl7hV7CHhNatxBawpyczxJY66np25nf'
           + 'ActLhph7b1o9zWc0+9OIXrZtZY5BuaRG9oIqKcDksi4873a1+pdeeQmBcD1xRrvcRVuWIQ+ZPFYwTtZ2Wl6c'
           + '8ihVrLTBzmNps4/fyjyR/bQgoxNOEkx/4z/RGhi82puPvbn61XRQj9RYoA1BPMnwPzqqh26Ki243824aNvyX'
           + 'TcEKClEYnqx63awDdNZY7kNT9Qw6u1MFVDQZWGScT/+4c9gU3Tlsdafry1QVnp0/+539CvEezaBRSTJGeP2z'
           + 'SqNfdZnstbR4THKzWuBQ15ceDglmMJd845q1cvsVI2lNBTJBMVcIYajhOiPJE1Ty1nDcfRBoJEryf1HkWif6'
           + 'ruCiDgvmpa5E2RAD//UPpG0f4/7F+E3wwFiOfriWrOnAUfTLkLV1TA5/Abn++h02XkfzJvf8aar1mtY3Y0ac'
           + 'qDPC1LNypBVPWy3AfWXrUSN19WgNpKXu8qTrM+YRCEVKWAL8s068DP9Cja2GHrEJtnWIhhZkHrHpe7r4jDq1'
           + 'rm9umfpvJSdYAi2pMOR5hln1eBKe0AJwjsJ7PwMW+b9SzdrOwvZYYfQpMOp5i4Oy2Hh7jOTTx0rcm+jCOBNq'
           + 'cleu++6KjDXZqQrPOKBNxbG7HVQoeeCz/paI3fnU/pVDFmc3iZuY9YEIaKmIBX5vjxaind6xiuQe7jpVukKt'
           + 'UYX2JjLWRx5R0C8X4bPsWOwWmcfhAMBO8Ixcz/HlcT7I+5CHvJLW0UpHpFmucBxYxpp3k+TgTakDuoupXADY'
           + 'n2tk6c27Apw+XcBfTsteOI8SmO9iwpAMow4sAXdtg0iU90vHxgvMhoqB77YyGqmbK7yhZjc1V78tjlmtDhax'
           + 'ht8XveuhTBnn/zi70jGPF10jp20NSRjaD7x/iXxNWO5Bhbn3BHnU0xqB30U8rESiTNAfsKGClfJ+m48lGD2l'
           + 'EqUUtQdIyZP+rnSXz+Qsi0Ji4HlF1tlnKKiX2dOiQdlqQXgqYUWibjeRMMBfLzrl2SSUh9Yd3OXErUuRo6wN'
           + 'sURbyDVT2BgguRHqtWjG7r+wkJ/fne5Ix3D4KE6XfBDc9I56flOZKv9TOlhUgOz/zA0cJDLxwE9nZ1MABLy8'
           + 'AAAAAAAAqAPWaAMAAAA6RrKGAXxY7BaZ25nfActn2XVusWAzzCitSBDf71Wdqwy0DR2SS9fKWFGzUpbF3jxO'
           + 'SP8sDhzszvL3S4Dl3vP6tcLMSiH4BrDAJcYHVT/ZIY53lykWwZgnbFpLLzBY74ifVULaZs08DQmTQ7qyscBr'
           + 'vvKvZkNsWY3xKnDhdtI6DyD4';

  return new Audio('data:audio/opus;base64,' + opus);
});
