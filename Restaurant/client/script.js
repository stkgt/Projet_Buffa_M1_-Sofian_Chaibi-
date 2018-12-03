window.onload = init;

function init() {
    new Vue({
        el: "#app",
        data: {
            restaurants: [],
            name: '',
            cuisine: '',
            nbRestaurants: 0,
            page: 0,
            pageSize: 10,
            filter: "",
            idRestaurantChange: 0

        },
        mounted() {
            console.log("avant affichage");
            this.getRestaurentFromServer();
        },
        methods: {
            getRestaurentFromServer() {
                console.log("Page size 2 : " + this.pageSize)
                let url = "";
                if (this.filter === "") {
                    // si on n'est pas dans la recherche
                    //console.log("Pas de recherche");
                    url = "http://localhost:8080/api/restaurants?page=" + this.page + "&pagesize=" + this.pageSize;
                }
                else {
                    //console.log("recherche");
                    url = "http://localhost:8080/api/restaurants?name=" + this.filter + "&page=" + this.page + "&pagesize=" + this.pageSize;
                }
                console.log("je vais chercher restaurants API");
                fetch(url)
                    .then((reponseJSON) => {
                        //on recupere le json
                        return reponseJSON.json();
                    })
                    .then((reponseJS) => {
                        this.restaurants = reponseJS.data;
                        this.nbRestaurants = reponseJS.count;
                    })
            },
            rechercheRestaurant(event) {
                this.getRestaurentFromServer();
            },
            supprimerRestaurant(restaurant) {
                //this.restaurants.splice(index, 1);
                // Pour éviter que la page ne se ré-affiche
                event.preventDefault();

                // Récupération du formulaire. Pas besoin de document.querySelector
                // ou document.getElementById puisque c'est le formulaire qui a généré
                // l'événement
                let index = restaurant._id;

                let url = "http://localhost:8080/api/restaurants/" + index;
                fetch(url, {
                    method: "DELETE",
                })
                    .then((responseJSON) => {
                        responseJSON.json()
                            .then((res) => {
                                // Maintenant res est un vrai objet JavaScript
                                console.log("supprimer")
                                this.getRestaurentFromServer()
                            });
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            },
            ajouterRestaurant(event) {
                // eviter le comportement par defaut
                event.preventDefault();
                //on recupere le formulaire et on envois en multipart
                let form = event.target;

                // Récupération des valeurs des champs du formulaire
                // en prévision d'un envoi multipart en ajax/fetch
                let donneesFormulaire = new FormData(form);

                let url = "http://localhost:8080/api/restaurants";

                fetch(url, {
                    method: "POST",
                    body: donneesFormulaire
                })
                    .then((responseJSON) => {
                        responseJSON.json()
                            .then((res) => { // arrow function preserve le this
                                // Maintenant res est un vrai objet JavaScript
                                console.log("ajouter")
                                this.getRestaurentFromServer()
                            });
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
                this.nom = "";
                this.cuisine = "";
            },
            modifierRestaurant(event) {
                // Pour éviter que la page ne se ré-affiche
                event.preventDefault();

                /* let div = document.getElementById("ModificationVisible");
                 if(div!=null)
                 {
                     div.id="ModificationHide";
                 }
                 */

                // Récupération du formulaire. Pas besoin de document.querySelector
                // ou document.getElementById puisque c'est le formulaire qui a généré
                // l'événement
                let form = event.target;
                // Récupération des valeurs des champs du formulaire
                // en prévision d'un envoi multipart en ajax/fetch
                let donneesFormulaire = new FormData(event.target);

                console.log(this.idRestaurantChange);


                let id = this.idRestaurantChange; // on peut aller chercher la valeur
                // d'un champs d'un formulaire
                // comme cela, si on connait le nom
                // du champ (valeur de son attribut name)

                let url = "/api/restaurants/" + id;

                fetch(url, {
                    method: "PUT",
                    body: donneesFormulaire
                })
                    .then((responseJSON) => {
                        responseJSON.json()
                            .then((res) => {
                                // Maintenant res est un vrai objet JavaScript
                                afficheReponsePUT(res);
                                //this.getRestaurentFromServer()
                            });
                    })
                    .catch(function (err) {
                        console.log(err);
                    });

            },
            getColor: function (index) {
                if (index % 2 == 0)
                    return "#ADD8E6"
                else
                    return "white"
            },
            pagePrecedente() {
                //permet de chargé une page precedente
                if (this.page > 0) {
                    this.page--;
                    this.getRestaurentFromServer();
                }
            },

            pageSuivante() {
                this.page++;
                this.getRestaurentFromServer();
            },
            pageDerniere() {
                if (this.nbRestaurants % 10 === 0)
                    this.page = Math.floor(this.nbRestaurants / this.pageSize) - 1;
                else
                    this.page = Math.floor(this.nbRestaurants / this.pageSize);
                this.getRestaurentFromServer();
            },
            pagePremiere() {
                this.page = 1;
                this.getRestaurentFromServer();
            },

            ChangeNbPage() {
                // changement du nombre d'info par page
                // console.log("Page size : "+this.pageSize);
                this.getRestaurentFromServer();
            },

            test() {
                console.log("salut")
            },

            onClickModifier(event, idRestaurant, numLigne = 0) {
                // Pour éviter que la page ne se ré-affiche
                event.preventDefault();

                let div = document.getElementById("ModificationHide");
                if (div != null) {
                    div.id = "ModificationVisible";
                }

                this.idRestaurantChange = idRestaurant;
                let lignesNames = document.getElementsByClassName("name");
                //recuperation des differentes cuisine
                let lignesCuisine = document.getElementsByClassName("cuisine");
                // selection de la ligne
                let ligneNom = lignesNames[numLigne];
                let ligneCuisine = lignesCuisine[numLigne];


                let nomRestaurant = document.getElementById("NomChange");
                nomRestaurant.value = ligneNom.innerText;
                let cuisineRestaurant = document.getElementById("CuisineChange");
                cuisineRestaurant.value = ligneCuisine.innerText;

                /*
                //recuperation des different nom
                 let lignesNames = document.getElementsByClassName("name");
                   //recuperation des differentes cuisine
                   let lignesCuisine = document.getElementsByClassName("cuisine");
                   // selection de la ligne
                   let ligneNom = lignesNames[numLigne];
                   let ligneCuisine = lignesCuisine[numLigne];

                   console.log(ligneNom);
                   console.log(ligneCuisine);

                   if (event.target.innerHTML === "Valider") {
                       event.target.innerHTML = "Modifier";
                       let nom= document.getElementById("nomInput");
                      // let nom= ligneNom.innerHTML.substring(ligneNom.innerHTML.indexOf("value=")+7,ligneNom.innerHTML.lastIndexOf("\""));
                       let cuisine= ligneCuisine.innerHTML.substring(ligneCuisine.innerHTML.indexOf("value=")+7,ligneCuisine.innerHTML.lastIndexOf("\""));

                       ligneNom.innerHTML = nom;
                       ligneCuisine.innerHTML = cuisine;

                       console.log(nom);
                       console.log(cuisine);
                       //todo put into dtabase
                       let donneesFormulaire = new FormData();

                       donneesFormulaire.append("nom",nom);
                       donneesFormulaire.append("cuisine",cuisine);

                       let url = "http://localhost:8080/api/restaurants/"+idRestaurant;

                       fetch(url, {
                           method: "PUT",
                           body: donneesFormulaire
                       })
                           .then((responseJSON) => {
                               responseJSON.json()
                                   .then((res) => { // arrow function preserve le this
                                       // Maintenant res est un vrai objet JavaScript
                                       console.log("ajouter")
                                       this.getRestaurentFromServer()
                                   });
                           })
                           .catch(function (err) {
                               console.log(err);
                           });
                   }
                   else {
                       event.target.innerHTML = "Valider";
                       //mettre les inputs pour la modification
                       ligneNom.innerHTML = "<input type=\"text\" id=\"nomInput\" value=\"" + ligneNom.innerHTML + "\">";
                       ligneCuisine.innerHTML = "<input type=\"text\" v-on:input=\"test\" value=\"" + ligneCuisine.innerHTML + "\">";
                   }*/
            }
        }
    })
}

/*    */