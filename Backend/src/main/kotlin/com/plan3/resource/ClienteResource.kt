package com.plan3.resource

import com.plan3.domain.Cliente
import com.plan3.service.ClienteService
import jakarta.inject.Inject
import jakarta.ws.rs.*
import jakarta.ws.rs.core.MediaType
import jakarta.ws.rs.core.Response

@Path("/clientes")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
class ClienteResource {

    @Inject
    lateinit var service: ClienteService

    @GET
    fun list(): List<Cliente> = service.listAll()

    @GET
    @Path("/{id}")
    fun get(@PathParam("id") id: Long): Response {
        val cliente = service.findById(id) ?: return Response.status(Response.Status.NOT_FOUND).build()
        return Response.ok(cliente).build()
    }

    @POST
    fun create(cliente: Cliente): Response {
        val created = service.create(cliente)
        return Response.status(Response.Status.CREATED).entity(created).build()
    }

    @PUT
    @Path("/{id}")
    fun update(@PathParam("id") id: Long, cliente: Cliente): Response {
        val updated = service.update(id, cliente) ?: return Response.status(Response.Status.NOT_FOUND).build()
        return Response.ok(updated).build()
    }

    @DELETE
    @Path("/{id}")
    fun delete(@PathParam("id") id: Long): Response {
        val deleted = service.delete(id)
        if (!deleted) return Response.status(Response.Status.NOT_FOUND).build()
        return Response.noContent().build()
    }
}
