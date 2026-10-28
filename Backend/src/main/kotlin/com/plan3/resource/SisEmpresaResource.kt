package com.plan3.resource

import com.plan3.domain.SisEmpresa
import com.plan3.repository.SisEmpresaRepository
import jakarta.inject.Inject
import jakarta.ws.rs.GET
import jakarta.ws.rs.Path
import jakarta.ws.rs.Produces
import jakarta.ws.rs.core.MediaType
import java.util.List

@Path("/sis-empresa")
@Produces(MediaType.APPLICATION_JSON)
class SisEmpresaResource {

    @Inject
    lateinit var repository: SisEmpresaRepository

    @GET
    fun list(): List<SisEmpresa> {
        return repository.listAll()
    }
}
