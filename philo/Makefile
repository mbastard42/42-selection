# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: mbastard <mbastard@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2022/04/06 20:41:19 by mbastard          #+#    #+#              #
#    Updated: 2022/06/25 21:55:12 by mbastard         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

SRC_DIR			:=	src/
OBJ_DIR			:=	obj/
BIN_DIR			:=	bin/

SRC				:=	init.c			main.c		check.c		destroy.c		\
					existence.c		time.c		utils.c		scene.c
SRC_PATH		:=	$(addprefix $(SRC_DIR), $(SRC))

OBJ				:=	${SRC_PATH:.c=.o}
OBJ_PATH		:=	$(subst $(SRC_DIR),$(OBJ_DIR), $(OBJ))

NAME			:=	philo
NAME_PATH		:=	$(addprefix $(BIN_DIR), $(NAME))

CC				:=	gcc
CFLAGS			:=	-Wall -Wextra -Werror
LFLAGS			:=	-lpthread

$(OBJ_DIR)%.o	: $(SRC_DIR)%.c
				@mkdir -p $(OBJ_DIR)
				@$(CC) $(CFLAGS) -c $< -o ${addprefix $(OBJ_DIR), ${<:$(SRC_DIR)%.c=%.o}}

${NAME_PATH}	: ${OBJ_PATH}
				@mkdir -p $(BIN_DIR)
				@$(CC) $(CFLAGS) $(LFLAGS) $(OBJ_PATH) -o $(NAME_PATH)

all				: $(NAME_PATH)

clean			:
				@rm -rf $(OBJ_DIR)

fclean			: clean
				@rm -rf $(BIN_DIR)

re				: fclean all

push			: fclean
				@git add *
				@git commit -m "quick push"
				@git push

.PHONY			: all clean fclean re push
