DROP FUNCTION string_score(original TEXT, query TEXT, fuzziness DOUBLE PRECISION);

-- Basically translated this algorithm:
-- https://github.com/joshaven/string_score/blob/master/string_score.js
CREATE OR REPLACE FUNCTION string_score(original TEXT, query TEXT, fuzziness REAL DEFAULT NULL) RETURNS REAL AS $$
DECLARE
  score REAL := 0;
  posn INTEGER := 1;
  fuzzies REAL := 1;
  fuzzyFactor REAL := 1 - fuzziness;
  loriginal TEXT := lower(unaccent(original));
  lquery TEXT := lower(unaccent(query));
BEGIN
  IF original = query THEN
    RETURN 1;
  END IF;
  IF query = '' THEN
    RETURN 0;
  END IF;
  FOR i IN 1..char_length(lquery) LOOP
    DECLARE
      indexOf INTEGER := 0;
      posnIndex INTEGER := 0;
      chScore REAL := 0;
    BEGIN
      -- find case insensitive
      indexOf := position(substring(lquery from i for 1) IN substring(loriginal from posn));
      IF (indexOf = 0) THEN
        IF fuzziness IS NULL THEN
          RETURN 0;
        END IF;
        fuzzies := fuzzies + fuzzyFactor;
      ELSE
        posnIndex := posn + indexOf - 1;
        IF indexOf = 1 THEN
          -- consecutive letter
          chScore := 0.7;
        ELSE
          chScore := 0.1;
          IF substring(original from posnIndex - 1 for 1) = ANY('{'' '', ''-'', ''.''}'::TEXT[])
          OR substring(original from posnIndex for 1) = upper(substring(original from posnIndex for 1))
          THEN
            -- acronym bonus
            chScore := chScore + 0.8;
          END IF;
        END IF;
        IF substring(query from i for 1) = substring(original from posnIndex for 1) THEN
          -- same case bonus
          chScore := chScore + 0.1;
        END IF;
        score := score + chScore;
        posn := posn + indexOf;
      END IF;
    END;
  END LOOP;

  score := 0.5 * (score / char_length(original) + score / char_length(query)) / fuzzies;

  IF score < 0.85 AND substring(loriginal from 1 for 1) = substring(lquery from 1 for 1) THEN
    score := score + 0.15;
  END IF;

  RETURN score;
END;
$$ LANGUAGE plpgsql;
