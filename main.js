var product = "Socks";

Vue.component("product", {
  props: {
    premium: {
      type: Boolean,
      required: true
    },
    cart: {
      type: Array
    }
  },
  template: `
        <div class="product">

        <div class="row">

            <div class="product-image col-sm-5">
                <img v-bind:src="image" v-bind:alt="altText">
            </div>

            <div class="product-info col-sm-7">
                <h1>{{ title }}</h1>
                <p class="bg-success text-center h5 py-2"v-if="inStock > 10">In Stock</p>
                <p class="bg-warning text-center h5 py-2"v-else-if="inStock <= 10 && inStock > 0">Hurry!! Nearly out of Stock!</p>
                <p class="bg-light text-center h5 py-2"v-else>Sorry,Out of Stock...</p>
                <div class="bg-light p-3 h6">
                    <p>Shipping: \${{ shipping }}</p>
                    <p>Current in stock: {{ inStock }}</p>
                    <p class="text-danger h4" v-if="onSale">On Sale!!</p>
                </div>

                <ul class="my-2">
                    <li class="lead" v-for="item in details">{{ item }}</li>
                </ul>

                <div class="color-box" v-for="(item, index) in variants" :key="item.variantId" @mouseover="imgToggle(index)"
                    :style="{backgroundColor: item.variantColor}">
                </div>

                <ul class="my-2">
                    <li class="lead" v-for="size in sizes">{{ size }}</li>
                </ul>

                <div>
                    <button class="btn btn-primary text-center" type="button" v-on:click="addCart" :disabled="!inStock" :class="{disabledButton: !inStock}">Add
                        to Cart</button>
                    <button class="btn btn-primary text-center" type="button" v-on:click="decCart" :disabled="!cartEmpty" :class="{disabledButton: !cartEmpty}">Delete item</button>
                </div>

            </div>
        </div>

        <div class="row">
            <div class="col-sm-6">
            <h2 class="h2">Reviews</h2>
            <p v-if="!reviews.length">There are no reviews yet.</p>
            <ul>
            <li v-for="item in reviews">
            <p>{{ item.name }}</p>
            <p>Rating: {{ item.rating }}</p>
            <p>{{ item.review }}</p>
            </li>
            </ul>
            </div>

            <div class="col-sm-6">
            <product-review @review-submitted="addReview"></product-review>
            </div>
        </div>

        </div>

        `,
  data() {
    return {
      product: "Socks",
      brand: "Vue Mastery",
      selectedVariant: 0,
      altText: "A pair of socks",
      onSale: true,
      details: ["80% cotton", "20% polyester", "Gender-neutral"],
      sizes: ["XL", "L", "M", "S"],
      variants: [
        {
          variantId: 2234,
          variantColor: "green",
          variantImg: "./img/green_socks.png",
          variantQuantity: 10
        },
        {
          variantId: 2235,
          variantColor: "blue",
          variantImg: "./img/blue_socks.png",
          variantQuantity: 20
        }
      ],
      reviews: []
    };
  },
  methods: {
    addCart: function() {
      this.$emit("add-to-cart", this.variants[this.selectedVariant].variantId);

      if (this.variants[this.selectedVariant].variantQuantity > 0) {
        this.variants[this.selectedVariant].variantQuantity -= 1;
      }
    },
    decCart: function() {
      this.$emit("delete-cart", this.variants[this.selectedVariant].variantId);
      this.variants[this.selectedVariant].variantQuantity += 1;
    },
    imgToggle: function(index) {
      this.selectedVariant = index;
    },
    addReview: function(productReview) {
      this.reviews.push(productReview);
    }
  },
  computed: {
    title() {
      return this.brand + " " + this.product;
    },
    image() {
      return this.variants[this.selectedVariant].variantImg;
    },
    inStock() {
      return this.variants[this.selectedVariant].variantQuantity;
    },
    shipping() {
      if (this.premium) {
        return "Free";
      }
      return 2.99;
    },
    cartEmpty() {
      if (this.cart.length) {
        return true;
      } else {
        false;
      }
    }
  }
});

Vue.component("product-review", {
  template: `<form class="review-form bg-light rounded" @submit.prevent="onSubmit">
    
  <p v-if="errors.length">
  <b>Please correct the following error(s):</b>
  <ul>
  <li v-for="err in errors">{{ err }}</li>
  </ul>
  </p>
  
  <p>
      <label for="name">Name:</label>
      <input id="name" v-model="name" @focus="clearErr" placeholder="name">
    </p>
    
    <p>
      <label for="review">Review:</label>      
      <textarea id="review" v-model="review" @focus="clearErr"></textarea>
    </p>
    
    <p>
      <label for="rating">Rating:</label>
      <select id="rating" v-model.number="rating" @focus="clearErr">
        <option>5</option>
        <option>4</option>
        <option>3</option>
        <option>2</option>
        <option>1</option>
      </select>
    </p>

    <p>Would you recommend this product?</p>
    <p>
      <input type="checkbox" name="feedback" v-model="recommendYes" @focus="clearErr">
    </p>
        
    <p>
      <input type="submit" value="Submit">  
    </p>    
  
  </form>`,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      recommendYes: null,
      errors: []
    };
  },
  methods: {
    onSubmit() {
      if (this.name && this.review && this.rating) {
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating,
          recommendYes: this.recommendYes
        };

        this.$emit("review-submitted", productReview);
        this.name = null;
        this.review = null;
        this.rating = null;
        this.recommendYes = null;
      } else {
        if (!this.name) this.errors.push("Name required.");
        if (!this.rating) this.errors.push("Rating required.");
        if (!this.review) this.errors.push("Review required.");
      }
    },
    clearErr() {
      this.errors = [];
    }
  }
});

var app = new Vue({
  el: "#app",
  data: {
    premium: false,
    cart: []
  },
  methods: {
    updateCart(id) {
      this.cart.push(id);
    },
    deleteCart(id) {
      if (this.cart.length > 0) {
        this.cart.pop(id);
      }
    }
  }
});
