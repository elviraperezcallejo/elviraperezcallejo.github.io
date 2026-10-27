/*
  PUBLICATIONS. Write my own name exactly as ME so it is highlighted.
  Fields: authors, title, venue, details, year, url (journal / repository), arxiv
          (label_es / details_es: Spanish version of label / details)
  When a preprint is published, move it from `preprints` to `papers` and add
  venue, details and url (keep the arxiv link).
*/
(function () {
  var ME = "E. Pérez-Callejo";
  window.ME = ME;
  window.PUBLICATIONS = {
    research: {
      papers: [
        { authors: ["C. Galindo", "F. Monserrat", ME], year: 2025,
          title: "Algebraic integrability with bounded genus",
          venue: "Journal of Differential Equations", details: "440:113466",
          url: "https://www.sciencedirect.com/science/article/pii/S0022039625004930",
          arxiv: "https://arxiv.org/abs/2401.09397" },
        { authors: ["C. Galindo", "F. Monserrat", "C.-J. Moreno-Ávila", ME], year: 2023,
          title: "On the degree of curves with prescribed multiplicities and bounded negativity",
          venue: "International Mathematics Research Notices", details: "2023:13757–13779",
          url: "http://dx.doi.org/10.1093/imrn/rnac085",
          arxiv: "https://arxiv.org/abs/2105.01483" },
        { authors: ["C. Galindo", "F. Monserrat", ME], year: 2022,
          title: "Algebraic integrability of planar polynomial vector fields by extension to Hirzebruch surfaces",
          venue: "Qualitative Theory of Dynamical Systems", details: "1–22",
          url: "https://link.springer.com/article/10.1007/s12346-022-00655-1",
          arxiv: "https://arxiv.org/abs/2202.06134" }
      ],
      preprints: [
        { authors: ["C. Galindo", "F. Monserrat", "C.-J. Moreno-Ávila", ME], year: 2026,
          title: "Nef divisors of surfaces given by pencils at infinity",
          venue: "arXiv:2602.15703", arxiv: "https://arxiv.org/abs/2602.15703" },
        { authors: ["C. Galindo", "F. Monserrat", ME], year: 2025,
          title: "Linear weighted bounded negativity",
          venue: "arXiv:2501.14519", arxiv: "https://arxiv.org/abs/2501.14519" }
      ],
      chapters: [
        { authors: ["P. Gimenez", ME], year: 2025,
          title: "Pruning algorithm of the Taylor resolution – an implementation",
          venue: "XVII Encuentro de Álgebra Computacional y Aplicaciones. XVII Meeting on Computer Algebra and Applications",
          url: "https://repositori.uji.es/items/b4c24145-1d5f-40c8-b211-fed5c0a3ec1b" }
      ],
      theses: [
        { label: "PhD Thesis", label_es: "Tesis doctoral", year: 2023, authors: [ME],
          title: "Algebraic integrability of foliations by extension to Hirzebruch surfaces. Applications to bounded negativity",
          venue: "Universitat Jaume I", details: "international mention", details_es: "mención internacional",
          url: "https://www.tdx.cat/handle/10803/689627" },
        { label: "Master Thesis", label_es: "Trabajo de Fin de Máster", year: 2020, authors: [ME],
          title: "Diagramas de Betti de ideales de aristas",
          venue: "Universidad de Valladolid",
          url: "https://uvadoc.uva.es/handle/10324/43429" },
        { label: "Final Degree Project", label_es: "Trabajo de Fin de Grado", year: 2019, authors: [ME],
          title: "Descomposición de ideales monomiales vía grafos y complejos simpliciales",
          venue: "Universidad de Valladolid",
          url: "https://uvadoc.uva.es/handle/10324/38220" }
      ]
    },
    education: {
      papers: [
        { authors: ["I. Epifanio", "A. Alcacer", "L. Ferrando", "X. Gual-Arnau", "A. Lloria", "H. Martín-Cruz",
                    "M. Martínez-Garcia", "J.-J. Moyano-Fernández", ME, "I. Sepúlveda"], year: 2023,
          title: "Integrating sustainable development goals in statistics and math subjects in university teaching",
          venue: "ICERI2023 Proceedings", details: "299–307",
          url: "https://library.iated.org/view/EPIFANIO2023INT" }
      ],
      books: [
        { authors: ["H. Martín-Cruz", "C. Moreno-Ávila", ME], year: 2024,
          title: "Aplicaciones prácticas de la matemática discreta",
          venue: "Publicacions de la Universitat Jaume I",
          url: "https://repositori.uji.es/items/f0eeb39f-5081-49f7-8c62-35ed654b543a" }
      ]
    }
  };
})();
