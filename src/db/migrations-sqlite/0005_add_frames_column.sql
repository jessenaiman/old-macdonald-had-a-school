-- Add frames column to standards for Ontario Kindergarten Program 2016
-- An expectation can belong to multiple frames (BC, SRWB, DLMB, PSI)
-- BC  = Belonging and Contributing
-- SRWB = Self-Regulation and Well-Being
-- DLMB = Demonstrating Literacy and Mathematics Behaviours
-- PSI  = Problem Solving and Innovating
ALTER TABLE standards ADD COLUMN frames TEXT;