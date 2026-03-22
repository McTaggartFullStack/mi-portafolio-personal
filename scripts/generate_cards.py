
projects = [
    {
        "url": "ropa.html",
        "title": "Moda & Estilo",
        "desc": "Tienda de ropa moderna con catálogo interactivo y carrito.",
        "img": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
        "tags": ["E-commerce", "Tailwind CSS", "JS"]
    },
    {
        "url": "cocina.html",
        "title": "Gourmet Kitchen",
        "desc": "Blog de cocina con recetas paso a paso y videoclases.",
        "img": "https://images.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&w=800&q=80",
        "tags": ["Blog", "Tailwind CSS", "Multimedia"]
    },
    {
        "url": "supermercado.html",
        "title": "FreshMarket",
        "desc": "Supermercado online con entrega a domicilio y ofertas frescas.",
        "img": "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",
        "tags": ["Tienda", "Tailwind CSS", "Delivery"]
    },
    {
        "url": "fitness.html",
        "title": "IronBody Gym",
        "desc": "Sitio web para gimnasio con planes de entrenamiento y horarios.",
        "img": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
        "tags": ["Salud", "Tailwind CSS", "Landing"]
    },
    {
        "url": "gaming.html",
        "title": "CyberZone",
        "desc": "Portal de noticias de videojuegos y reseñas de hardware.",
        "img": "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
        "tags": ["Gaming", "Tailwind CSS", "News"]
    },
    {
        "url": "viajes.html",
        "title": "Wanderlust Travel",
        "desc": "Agencia de viajes con destinos exóticos y paquetes turísticos.",
        "img": "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80",
        "tags": ["Turismo", "Tailwind CSS", "Booking"]
    },
    {
        "url": "foro-tech.html",
        "title": "DevTalk Forum",
        "desc": "Comunidad de desarrolladores para compartir código y resolver dudas.",
        "img": "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=800&q=80",
        "tags": ["Foro", "Tailwind CSS", "Comunidad"]
    },
    {
        "url": "foro-gaming.html",
        "title": "Nexus Gaming Forum",
        "desc": "Foro de discusión sobre videojuegos, e-sports y comunidades.",
        "img": "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80",
        "tags": ["Foro", "Tailwind CSS", "Gaming"]
    },
    {
        "url": "foro-ayuda.html",
        "title": "HelpHub Support",
        "desc": "Centro de ayuda y soporte técnico con base de conocimientos.",
        "img": "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80",
        "tags": ["Soporte", "Tailwind CSS", "Helpdesk"]
    },
    {
        "url": "agencia.html",
        "title": "Stellar Agency",
        "desc": "Agencia digital creativa especializada en branding y diseño web.",
        "img": "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
        "tags": ["Agencia", "Tailwind CSS", "Creativo"]
    },
    {
        "url": "banda.html",
        "title": "The Void",
        "desc": "Sitio oficial de banda de rock con fechas de tour y discografía.",
        "img": "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&w=800&q=80",
        "tags": ["Música", "Tailwind CSS", "Eventos"]
    },
    {
        "url": "fotografia.html",
        "title": "Lumen Photography",
        "desc": "Portafolio minimalista de fotografía artística y urbana.",
        "img": "https://images.unsplash.com/photo-1496345962527-29757c3a3d94?auto=format&fit=crop&w=800&q=80",
        "tags": ["Portfolio", "Tailwind CSS", "Arte"]
    }
]

html_output = ""

for p in projects:
    tags_html = ""
    colors = ["purple", "blue", "yellow", "green", "pink", "indigo"]
    for i, tag in enumerate(p['tags']):
        color = colors[i % len(colors)]
        tags_html += f"""
        <span class="px-3 py-1 bg-{color}-100 text-{color}-700 text-sm rounded-full">
         {tag}
        </span>"""

    card_html = f"""
     <a href="{p['url']}" class="block fade-in card-zoom card-service bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg group">
      <div class="relative overflow-hidden h-64 bg-gray-100 dark:bg-gray-700">
       <img alt="{p['title']}" class="w-full h-full object-cover project-img" decoding="async" loading="lazy" src="{p['img']}"/>
       <div class="absolute top-4 right-4">
        <span class="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full">
         Nuevo
        </span>
       </div>
      </div>
      <div class="p-6">
       <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">
        {p['title']}
       </h3>
       <p class="text-gray-600 dark:text-gray-300 mb-4">
        {p['desc']}
       </p>
       <div class="flex flex-wrap gap-2 mb-4">{tags_html}
       </div>
       <div class="inline-flex items-center text-purple-600 font-semibold group-hover:text-purple-800 transition-colors duration-300 group" >
        Ver Proyecto
                            →
       </div>
      </div>
     </a>"""
    html_output += card_html

with open("new_cards_content.html", "w") as f:
    f.write(html_output)

print("HTML generated.")
