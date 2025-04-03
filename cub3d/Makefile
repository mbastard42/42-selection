# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: hugovincent <hugovincent@student.42.fr>    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2022/08/07 22:28:48 by mbastard          #+#    #+#              #
#    Updated: 2022/11/24 09:28:18 by hugovincent      ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

BIN				:=	bin/
NAME			:=	cub3d
NAME_PATH		:=	$(addprefix $(BIN), $(NAME))
MAKEFLAGS		+=	--silent

SDIR			:=	src/
SRC				:=	$(shell find src -name "*.c")

ODIR			:=	obj/
OBJ				:=	$(subst $(SDIR),$(ODIR), ${SRC:.c=.o})

LFT_DIR			:=	libft/
LFT				:=	$(addprefix $(LFT_DIR)$(BIN), libft.a)

MLX_DIR			:=	minilibx/
MLX				:=	$(addprefix $(MLX_DIR), libmlx.a)

CC				:=	gcc
CFLG			:=	-Wall -Wextra -Werror -Imlx
LFLG			:=	-framework OpenGL -framework AppKit -lz

$(ODIR)%.o		: $(SDIR)%.c
				mkdir -p $(subst $(SDIR),$(ODIR), $(shell dirname $<)/)
				$(CC) $(CFLG) -c $< -o ${addprefix $(ODIR), ${<:$(SDIR)%.c=%.o}}

${NAME_PATH}	: $(OBJ)
				mkdir -p $(BIN)
				cd $(LFT_DIR) && make all
				cd $(MLX_DIR) && make all
				$(CC) $(LFLG) $(LFT) $(MLX) $(OBJ) -o $(NAME_PATH)

all				: $(NAME_PATH)

clean			:
				cd $(LFT_DIR) && make clean
				rm -rf $(ODIR)

fclean			: clean
				cd $(LFT_DIR) && make fclean
				cd $(MLX_DIR) && make clean
				rm -rf $(BIN)

re				: fclean all

.PHONY			: all clean fclean re
