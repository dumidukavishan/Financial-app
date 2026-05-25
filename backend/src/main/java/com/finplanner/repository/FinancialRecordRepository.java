package com.finplanner.repository;

import com.finplanner.entity.FinancialRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface FinancialRecordRepository extends JpaRepository<FinancialRecord, UUID> {

    Page<FinancialRecord> findByUserIdAndDeletedFalseOrderByRecordDateDesc(UUID userId, Pageable pageable);

    List<FinancialRecord> findByUserIdAndDeletedFalse(UUID userId);

    Optional<FinancialRecord> findByIdAndUserId(UUID id, UUID userId);

    List<FinancialRecord> findByUserIdAndDeletedFalseAndRecordDateBetweenOrderByRecordDateDesc(
            UUID userId, LocalDate startDate, LocalDate endDate);

    List<FinancialRecord> findByUserIdAndCategoryIdAndDeletedFalseOrderByRecordDateDesc(
            UUID userId, UUID categoryId);

    @Query("SELECT COALESCE(SUM(r.amount), 0) FROM FinancialRecord r WHERE r.user.id = :userId AND r.type = :type AND r.deleted = false")
    BigDecimal sumByUserIdAndType(@Param("userId") UUID userId, @Param("type") FinancialRecord.RecordType type);

    @Query("SELECT COALESCE(SUM(r.amount), 0) FROM FinancialRecord r WHERE r.user.id = :userId AND r.type = :type AND r.deleted = false AND r.recordDate BETWEEN :start AND :end")
    BigDecimal sumByUserIdAndTypeAndDateBetween(@Param("userId") UUID userId, @Param("type") FinancialRecord.RecordType type,
                                                 @Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT r.type, COALESCE(SUM(r.amount), 0) FROM FinancialRecord r WHERE r.user.id = :userId AND r.deleted = false AND r.recordDate BETWEEN :start AND :end GROUP BY r.type")
    List<Object[]> sumGroupedByTypeAndDateBetween(@Param("userId") UUID userId, @Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT FUNCTION('TO_CHAR', r.recordDate, 'YYYY-MM'), r.type, COALESCE(SUM(r.amount), 0) FROM FinancialRecord r WHERE r.user.id = :userId AND r.deleted = false AND r.recordDate BETWEEN :start AND :end GROUP BY FUNCTION('TO_CHAR', r.recordDate, 'YYYY-MM'), r.type ORDER BY FUNCTION('TO_CHAR', r.recordDate, 'YYYY-MM')")
    List<Object[]> monthlyTrendsByUser(@Param("userId") UUID userId, @Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT r FROM FinancialRecord r WHERE r.user.id = :userId AND r.deleted = false ORDER BY r.createdAt DESC")
    List<FinancialRecord> findRecentByUserId(@Param("userId") UUID userId, Pageable pageable);

    List<FinancialRecord> findByUserIdAndTypeAndDeletedFalseOrderByRecordDateDesc(UUID userId, FinancialRecord.RecordType type);

    @Query("SELECT r.category.name, COALESCE(SUM(r.amount), 0) FROM FinancialRecord r WHERE r.user.id = :userId AND r.type = :type AND r.deleted = false AND r.category IS NOT NULL AND r.recordDate BETWEEN :start AND :end GROUP BY r.category.name ORDER BY SUM(r.amount) DESC")
    List<Object[]> sumByCategoryAndType(@Param("userId") UUID userId, @Param("type") FinancialRecord.RecordType type, @Param("start") LocalDate start, @Param("end") LocalDate end);
}
