package com.plan3.repository

import com.plan3.domain.Cliente
import jakarta.enterprise.context.ApplicationScoped
import java.time.LocalDateTime

@ApplicationScoped
class ClienteRepository : BaseRepository<Cliente>() {

    fun findAllActive(): List<Cliente> {
        return list("deleteAt is null")
    }

    fun softDelete(id: Long): Boolean {
        val cliente = findById(id) ?: return false
        if (cliente.deleteAt != null) return false
        cliente.deleteAt = LocalDateTime.now()
        cliente.persist()
        return true
    }
}
