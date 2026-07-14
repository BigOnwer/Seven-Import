"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus, Package } from "lucide-react";

import ProductForm from "./ProductForm";
import {
  useProducts,
  deleteProduct,
  type ApiProduct
} from "@/lib/useProducts";


export default function ProductList() {

  const {
    products,
    loading,
    error,
    refresh
  } = useProducts({
    page: 1,
    limit: 100
  });


  const [editing, setEditing] = useState<ApiProduct | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);



  async function handleDelete(id:number){

    const confirmDelete = confirm(
      "Tem certeza que deseja excluir este produto?"
    );

    if(!confirmDelete) return;


    setDeleting(id);


    const result = await deleteProduct(id);


    setDeleting(null);


    if(result.success){
      refresh();
    }else{
      alert(result.error);
    }

  }



  /*
    Tela de criar produto
  */
  if(creating){

    return (
      <ProductForm

        onCancel={() => setCreating(false)}

        onSuccess={() => {
          setCreating(false);
          refresh();
        }}

      />
    );

  }



  /*
    Tela de editar produto
  */
  if(editing){

    return (
      <ProductForm

        product={editing}

        onCancel={() => setEditing(null)}

        onSuccess={() => {
          setEditing(null);
          refresh();
        }}

      />
    );

  }




  return (

    <div>


      {/* Header */}

      <div
        style={{
          display:"flex",
          justifyContent:"space-between",
          alignItems:"center",
          marginBottom:30
        }}
      >

        <div>

          <h1
            className="font-display"
            style={{
              fontSize:36,
              color:"var(--white)"
            }}
          >
            GERENCIAR <span style={{color:"var(--gold)"}}>
              PRODUTOS
            </span>
          </h1>


          <p
            style={{
              color:"#777",
              fontSize:14
            }}
          >
            {products.length} produtos cadastrados
          </p>

        </div>



        <button

          onClick={() => setCreating(true)}

          style={{
            background:"var(--gold)",
            color:"#111",
            border:"none",
            borderRadius:8,
            padding:"12px 20px",
            display:"flex",
            alignItems:"center",
            gap:8,
            cursor:"pointer",
            fontWeight:700
          }}

        >

          <Plus size={17}/>
          Novo produto

        </button>


      </div>




      {
        loading && (

          <p style={{color:"#888"}}>
            Carregando produtos...
          </p>

        )
      }



      {
        error && (

          <div
            style={{
              background:"rgba(231,76,60,.1)",
              border:"1px solid rgba(231,76,60,.3)",
              padding:15,
              borderRadius:8,
              color:"#e74c3c"
            }}
          >
            {error}
          </div>

        )
      }





      {/* Lista */}

      <div

        style={{
          display:"grid",
          gridTemplateColumns:
          "repeat(auto-fill,minmax(280px,1fr))",
          gap:20
        }}

      >


        {
          products.map(product => (

            <ProductCard

              key={product.id}

              product={product}

              onEdit={() => setEditing(product)}

              onDelete={() => handleDelete(product.id)}

              deleting={deleting === product.id}

            />

          ))
        }



      </div>


    </div>

  );

}






function ProductCard({
  product,
  onEdit,
  onDelete,
  deleting
}:{
  product:ApiProduct;
  onEdit:()=>void;
  onDelete:()=>void;
  deleting:boolean;
}){


  return (

    <div

      style={{
        background:"var(--black-2)",
        border:"1px solid rgba(255,255,255,.08)",
        borderRadius:12,
        overflow:"hidden"
      }}

    >


      {/* imagem */}

      <div
        style={{
          height:200,
          background:"#080808"
        }}
      >

        {
          product.images.length > 0 ?

          <img

            src={product.images[0]}

            alt={product.name}

            style={{
              width:"100%",
              height:"100%",
              objectFit:"cover"
            }}

          />

          :

          <div

            style={{
              height:"100%",
              display:"flex",
              justifyContent:"center",
              alignItems:"center",
              color:"#555"
            }}

          >

            <Package size={40}/>

          </div>

        }

      </div>





      <div style={{padding:20}}>


        <h3

          style={{
            color:"white",
            marginBottom:8
          }}

        >

          {product.name}

        </h3>



        <p
          style={{
            color:"var(--gold)",
            fontWeight:700,
            fontSize:18
          }}
        >

          R$ {product.price.toFixed(2)}

        </p>



        <div

          style={{
            display:"flex",
            justifyContent:"space-between",
            color:"#777",
            fontSize:13,
            marginTop:10
          }}

        >

          <span>
            Estoque: {product.stock}
          </span>


          <span>
            {product.category}
          </span>


        </div>




        <div

          style={{
            display:"flex",
            gap:10,
            marginTop:20
          }}

        >


          <button

            onClick={onEdit}

            style={{
              flex:1,
              height:38,
              background:"transparent",
              border:"1px solid rgba(255,255,255,.15)",
              color:"white",
              borderRadius:6,
              cursor:"pointer",
              display:"flex",
              alignItems:"center",
              justifyContent:"center",
              gap:6
            }}

          >

            <Pencil size={14}/>
            Editar

          </button>





          <button

            onClick={onDelete}

            disabled={deleting}

            style={{
              width:45,
              background:"rgba(231,76,60,.1)",
              border:"1px solid rgba(231,76,60,.3)",
              color:"#e74c3c",
              borderRadius:6,
              cursor:"pointer",
              display:"flex",
              alignItems:"center",
              justifyContent:"center"
            }}

          >

            <Trash2 size={15}/>

          </button>



        </div>


      </div>


    </div>

  );

}