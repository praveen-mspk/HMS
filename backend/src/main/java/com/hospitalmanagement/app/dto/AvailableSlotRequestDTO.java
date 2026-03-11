package com.hospitalmanagement.app.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class AvailableSlotRequestDTO {

    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
}