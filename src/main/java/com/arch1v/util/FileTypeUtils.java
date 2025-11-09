package com.arch1v.util;

import java.util.Locale;

public final class FileTypeUtils {
    private FileTypeUtils() {}
    public static String topLevelFolder(String filename, String mime) {
        String name = filename.toLowerCase(Locale.ROOT);
        if (mime != null && mime.startsWith("image")) return "Images";
        if (mime != null && mime.startsWith("video")) return "Videos";
        if (mime != null && mime.startsWith("audio")) return "Audio";
        if (name.endsWith(".pdf") || name.endsWith(".doc") || name.endsWith(".docx") ||
            name.endsWith(".ppt") || name.endsWith(".pptx") || name.endsWith(".xls") ||
            name.endsWith(".xlsx") || name.endsWith(".txt") || name.endsWith(".md")) return "Documents";
        if (name.endsWith(".zip") || name.endsWith(".rar") || name.endsWith(".7z") ||
            name.endsWith(".tar") || name.endsWith(".gz")) return "Archives";
        if (name.endsWith(".java") || name.endsWith(".kt") || name.endsWith(".py") ||
            name.endsWith(".js") || name.endsWith(".ts") || name.endsWith(".go") ||
            name.endsWith(".rb") || name.endsWith(".c")  || name.endsWith(".cpp")) return "Code";
        return "Misc";
    }
}
